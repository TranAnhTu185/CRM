'use client';

import { useEffect, useRef, useState } from 'react';
import BpmnJS, { BpmnModeler } from 'bpmn-js/lib/Modeler';
import CustomRenderer from './CustomRenderer';
import ContextMenu from './menu-right-click/ContextMenu';
import elExModdle from './jsons/elEx-moddle.json';
import configExModdle from './jsons/configEx-moddle.json';

const EMPTY_DIAGRAM = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions id="cogover-diagram" targetNamespace="http://bpmn.io/schema/bpmn"
	xmlns:bioc="http://bpmn.io/schema/bpmn/biocolor/1.0"
	xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL"
	xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
	xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
	xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
	xmlns:themeEx="http://theme-ex/schema"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">
    <bpmn2:process id="BlankProcess" isExecutable="true">
    </bpmn2:process>
    <bpmndi:BPMNDiagram id="BPMNDiagram_Blank">
        <bpmndi:BPMNPlane bpmnElement="BlankProcess" id="BPMNPlane_Blank"/>
    </bpmndi:BPMNDiagram>
</bpmn2:definitions>
`;
export default function BpmnCanvas({
  onModelerReady,
}: {
  onModelerReady: (modeler: BpmnJS) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [modeler, setModeler] = useState<BpmnJS | null>(null);
  const [menu, setMenu] = useState<{ x: number, y: number, elementId: string } | null>(null);
  const modelerRef = useRef<BpmnModeler>(null);
  const [connectMode, setConnectMode] = useState(false);
  const [connectMenu, setConnectMenu] = useState(false);

  const [connectingNode, setConnectingNode] = useState<any>(null);


  useEffect(() => {
    if (!containerRef.current) return;

    const bpmnModeler = new BpmnJS({
      container: containerRef.current,
      moddleExtensions: {
        elEx: elExModdle,
        configEx: configExModdle
      },
      additionalModules: [
        {
          __init__: ['customRenderer'],
          customRenderer: ['type', CustomRenderer],
          bendpoints: ['value', null],
          labelEditingProvider: ['value', null]
        }
      ]
    });

    bpmnModeler
      .importXML(EMPTY_DIAGRAM)
      .then(() => {
        setModeler(bpmnModeler);
        onModelerReady(bpmnModeler);
      })
      .catch((err: any) => {
        console.error('❌ Import XML error', err);
      });

    modelerRef.current = bpmnModeler;

    bpmnModeler.on('element.contextmenu', (event: any) => {
      const element = event.element;
      event.originalEvent.preventDefault();
      if (element.type !== 'bpmn:Process') {
        const { clientX: x, clientY: y } = event.originalEvent;
        setMenu({ x, y, elementId: event.element.id });
      }
    });

    return () => bpmnModeler.destroy();
  }, [onModelerReady]);

  const handleConnect = () => {
    setConnectMode(true);
    setConnectMenu(true);
    setConnectingNode(menu!.elementId);
    setMenu(null);
  };

  const handleDelete = () => {
    if (!modelerRef.current) return;

    const elementRegistry = modelerRef.current.get('elementRegistry');
    const modeling = modelerRef.current.get('modeling');

    const element = elementRegistry.get(menu!.elementId);
    if (element) {
      modeling.removeElements([element]);
      setMenu(null);
    }
  };

  if (modeler) {
    modeler.get('eventBus').off('element.click'); // clear trước để tránh double bind
    if (connectMode) {
      modeler.get('eventBus').on('element.click', (e: any) => {
        const element = e.element;
        // bỏ qua click vào diagram/background
        if (!element || element.type === 'bpmn:Process') return;

        const modeling = modeler!.get('modeling');
        if (connectMenu) {
          const elementRegistry = modelerRef.current!.get('elementRegistry');
          const source = elementRegistry.get(connectingNode);
          modeling.connect(source, element, {
            type: 'bpmn:SequenceFlow',
          });
          setConnectingNode(null); // reset sau khi nối xong
          setConnectMode(false); // tắt connect mode
          setConnectMenu(false);
        } else {
          const elementRegistry = modelerRef.current!.get('elementRegistry');
          const sourceRef = elementRegistry.get(connectingNode.id);
          const targetRef = elementRegistry.get(element.id);
          if (sourceRef && targetRef) {
            modeling.connect(sourceRef, targetRef);
          }
          setConnectingNode(null); // reset sau khi nối xong
          setConnectMode(false); // tắt connect mode
        }
      });
    } else {
      modeler.get('eventBus').on('element.click', (e: any) => {
        const element = e.element;
        setConnectMenu(false);
        setConnectMode(true);
        setConnectingNode(element);
      });
    }
  }


  return <div className='flex-1'>
    {menu && (
      <ContextMenu
        x={menu.x}
        y={menu.y}
        onConfig={() => console.log('Config', menu.elementId)}
        onConnect={handleConnect}
        onDelete={handleDelete}
      />
    )}
    <div ref={containerRef} className="w-full rounded h-screen border border-gray-200" />
  </div>;
}
