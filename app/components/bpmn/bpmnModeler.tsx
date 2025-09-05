'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import BpmnJS, { BpmnModeler } from 'bpmn-js/lib/Modeler';
import CustomRenderer from './CustomRenderer';
import ContextMenu from './menu-right-click/ContextMenu';
import elExModdle from './jsons/elEx-moddle.json';
import configExModdle from './jsons/configEx-moddle.json';
import "./css/style.css";
import GoForm from '@/app/components/form/page';
import { NodeModel, useManagerBpmnContext } from '@/app/libs/contexts/manager-bpmn-context';

const EMPTY_DIAGRAM = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:themeEx="http://theme-ex/schema" id="cogover-diagram" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn2:process id="BlankProcess" isExecutable="true">
    <bpmn2:startEvent id="Event_09wddjx" name="Start" />
  </bpmn2:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_Blank">
    <bpmndi:BPMNPlane id="BPMNPlane_Blank" bpmnElement="BlankProcess">
      <bpmndi:BPMNShape id="Event_09wddjx_di" bpmnElement="Event_09wddjx">
        <dc:Bounds x="179" y="289" width="62" height="62" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="198" y="358" width="24" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn2:definitions>
`;

export default function BpmnCanvas({
  onModelerReady,
}: {
  onModelerReady: (modeler: BpmnJS) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const modelerRef = useRef<BpmnModeler | null>(null);
  const { data, setData } = useManagerBpmnContext()

  const [modeler, setModeler] = useState<BpmnJS | null>(null);
  const [menu, setMenu] = useState<{ x: number; y: number; elementId: string } | null>(null);

  const [connectMode, setConnectMode] = useState(false);
  const [connectingNode, setConnectingNode] = useState<string | null>(null);

  const [elementSec, setElementSec] = useState<any>(null);
  const [nodeSec, setNodeSec] = useState<NodeModel>();
  const goForm = useRef<any>(null);

  // Khởi tạo modeler
  useEffect(() => {
    if (!containerRef.current) return;

    const bpmnModeler = new BpmnJS({
      container: containerRef.current,
      moddleExtensions: {
        elEx: elExModdle,
        configEx: configExModdle,
      },
      additionalModules: [
        {
          __init__: ['customRenderer'],
          customRenderer: ['type', CustomRenderer],
          bendpoints: ['value', null],
          labelEditingProvider: ['value', null],
        },
      ],
    });

    bpmnModeler
      .importXML(EMPTY_DIAGRAM)
      .then(() => {
        setModeler(bpmnModeler);
        onModelerReady(bpmnModeler);
      })
      .catch((err: any) => console.error('❌ Import XML error', err));

    modelerRef.current = bpmnModeler;

    // Right click
    const contextMenuHandler = (event: any) => {
      event.originalEvent.preventDefault();
      if (event.element.type !== 'bpmn:Process') {
        const { clientX: x, clientY: y } = event.originalEvent;
        setMenu({ x, y, elementId: event.element.id });
      }
    };

    bpmnModeler.on('element.contextmenu', contextMenuHandler);

    // Double click node
    bpmnModeler.on('element.dblclick', (event: any) => {
      const element = event.element;
      const label =
        element.businessObject?.name || element.labels?.[0]?.businessObject?.text || '';
      setElementSec({ ...element, label });
    });

    return () => {
      bpmnModeler.off('element.contextmenu', contextMenuHandler);
      bpmnModeler.destroy();
    };
  }, [onModelerReady]);

  useEffect(() => {
    if (elementSec) {
      const node = data.find(n => n.id === elementSec.id);
      console.log('node', node)
      setNodeSec(node);
      goForm.current?.openModal?.();

    }
  }, [elementSec])

  // Xử lý connect mode
  useEffect(() => {
    if (!modeler || !connectMode || !connectingNode) return;
    const eventBus = modeler.get('eventBus');

    const handleClick = (e: any) => {
      const element = e.element;
      if (!element || element.type === 'bpmn:Process') return;

      const modeling = modeler.get('modeling');
      const source = modeler.get('elementRegistry').get(connectingNode);

      modeling.connect(source, element, { type: 'bpmn:SequenceFlow' });

      setConnectMode(false);
      setConnectingNode(null);
      removeOutline();
    };

    eventBus.on('element.click', handleClick);
    return () => eventBus.off('element.click', handleClick);
  }, [connectMode, modeler, connectingNode]);

  // Remove highlight / overlays
  const removeOutline = () => {
    if (!modeler) return;
    const overlays = modeler.get('overlays');
    const elementRegistry = modeler.get('elementRegistry');
    elementRegistry.getAll().forEach((el: any) => {
      const gfx = elementRegistry.getGraphics(el);
      gfx.classList.remove('custom-highlight');
    });
    overlays.clear();
  };

  // Menu actions
  const handleConnect = () => {
    if (!menu) return;
    setConnectMode(true);
    setConnectingNode(menu.elementId);
    setMenu(null);
  };

  const handleDelete = () => {
    if (!menu || !modelerRef.current) return;
    const elementRegistry = modelerRef.current.get('elementRegistry');
    const modeling = modelerRef.current.get('modeling');

    const element = elementRegistry.get(menu.elementId);
    if (element) {
      modeling.removeElements([element]);
      setMenu(null);
    }
  };

  // Cập nhật label node sau khi submit form
  const handleSubmitFromDrawer = (values: any) => {
    console.log('andn')
    if (!modelerRef.current || !elementSec) return;
    const elementRegistry = modelerRef.current.get('elementRegistry');
    const modeling = modelerRef.current.get('modeling');
    const element = elementRegistry.get(elementSec.id);
    if (element) modeling.updateLabel(element, values.name);
    const infoNode: NodeModel = {
      id: elementSec.id,
      name: values.name,
      info: values,
      type: elementSec.type,
      x: elementSec.x,
      y: elementSec.y,
      width: elementSec.width,
      height: elementSec.height,
      businessObject: elementSec.businessObject
    }
    if (data.some(n => n.id === elementSec.id)) {
      setData(
        data.map(n =>
          n.id === elementSec.id
            ? { ...n, ...infoNode }
            : n
        )
      );
      console.log('update', data)
      return
    }
    setData([...data, infoNode])
    console.log('add', data)
  };

  return (
    <div className="w-full h-full flex flex-col">
      {menu && (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          onConfig={() => console.log('Config', menu.elementId)}
          onConnect={handleConnect}
          onDelete={handleDelete}
        />
      )}
      <div ref={containerRef} className="w-full rounded h-full border border-gray-200" />
      <Suspense fallback={<div></div>}>
        <GoForm ref={goForm} elementProp={elementSec} data={nodeSec} onSubmit={handleSubmitFromDrawer} />
      </Suspense>
    </div>
  );
}
