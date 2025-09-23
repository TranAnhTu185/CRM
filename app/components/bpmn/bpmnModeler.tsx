'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import BpmnJS, { BpmnModeler } from 'bpmn-js/lib/Modeler';
import CustomRenderer from './CustomRenderer';
import ContextMenu from './menu-right-click/ContextMenu';
import elExModdle from './jsons/elEx-moddle.json';
import configExModdle from './jsons/configEx-moddle.json';
import GoForm from '@/app/components/form/GoForm';
import { NodeModel, useManagerBpmnContext } from '@/app/libs/contexts/manager-bpmn-context';
import labelEditingProviderModule from "bpmn-js/lib/features/label-editing";
import bendpointsModule from "diagram-js/lib/features/bendpoints";
import "./css/style.css";

export default function BpmnCanvas({
  xml,
  onModelerReady,
}: {
  xml: string;
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
          labelEditingProvider: ['value', null],
          paletteProvider: ["value", null],
          labelEditingProviderModule,
          bendpointsModule
        },
      ],
      bendpoints: {
        autoActivate: true   // luôn bật bendpoints khi chọn connection
      }
    });

    bpmnModeler
      .importXML(xml)
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
  }, [onModelerReady, xml]);

  useEffect(() => {
    if (elementSec) {
      const node = data.find(n => n.id === elementSec.id);
      if (node) {
        setNodeSec(node);
      }
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

  if (modeler) {
    //event connect node when clik
    modeler.get('eventBus').off('element.click'); // clear trước để tránh double bind
    if (connectMode) {
      modeler.get('eventBus').on('element.click', (e: any) => {
        const element = e.element;
        // bỏ qua click vào diagram/background
        if (!element || element.type === 'bpmn:Process') return;
        if (element.type === "bpmn:SequenceFlow") {
          setConnectMode(false);
          const note = prompt("Nhập ghi chú cho đường nối:", element.businessObject.$attrs["note"] || "");
          if (note !== null) {
            const modeling = modeler.get("modeling");
            modeling.updateLabel(element, note);
          }
        } else {
          const modeling = modeler!.get('modeling');
          const elementRegistry = modelerRef.current!.get('elementRegistry');
          const source = elementRegistry.get(connectingNode);
          modeling.connect(source, element, {
            type: 'bpmn:SequenceFlow',
          });
          setConnectingNode(null); // reset sau khi nối xong
          setConnectMode(false); // tắt connect mode
          removeOutline();
        }
      });

      modeler.get('eventBus').on('connect.end', (e: any) => {
        const { source, target, connection } = e.context;

        if (target) {
          removeOutline();
          setConnectMode(false);
        } else {
          console.log('❌ Thả vào chỗ trống, không tạo connection');
        }
      });

    } else {
      modeler.get('eventBus').on('element.click', (e: any) => {
        const element = e.element;
        setConnectingNode(element);
        const overlays = modeler.get('overlays');
        const elementRegistry = modeler.get('elementRegistry');
        elementRegistry.getAll().forEach((el: any) => {
          if (el !== element) {
            const gfx = elementRegistry.getGraphics(el);
            gfx.classList.remove('custom-highlight');
          }
        });
        overlays.clear();

        if (element) {
          if (element.type !== "bpmn:Process") {
            if (element.type === "bpmn:SequenceFlow") {
              setConnectMode(false);
              const note = prompt("Nhập ghi chú cho đường nối:", element.businessObject.$attrs["note"] || "");
              if (note !== null) {
                const modeling = modeler.get("modeling");
                modeling.updateLabel(element, note);
              }
            } else {
              const gfx = elementRegistry.getGraphics(element);
              if (gfx.classList.contains('custom-highlight')) {
                gfx.classList.remove('custom-highlight');
                overlays.clear();
              } else {
                gfx.classList.add('custom-highlight');
                const target = element.labelTarget || element;

                const size = 64;

                const positions = [
                  { top: -12, left: size / 2 - 6 },   // top-center
                  { left: -12, top: size / 2 - 6 },   // middle-left
                  { top: size - 2, left: size / 2 - 6 }, // bottom-center
                  { left: size - 2, top: size / 2 - 6 }  // middle-right
                ];
                positions.forEach(pos => {
                  overlays.add(target, {
                    position: pos,
                    html: (() => {
                      const dot = document.createElement('div');
                      dot.classList.add('custom-resizer');
                      dot.addEventListener('click', (ev) => {
                        ev.stopPropagation();
                        setConnectMode(true);
                        const connect = modeler.get('connect');
                        connect.start(e.originalEvent, element);
                      });

                      return dot;
                    })()
                  });
                });
              }
            }
          }
        }

      });

    }

    const eventBus = modeler.get('eventBus');
    //event double click node
    eventBus.on('element.dblclick', function (event: any) {
      const element = event.element; // node được double click

      let label: string | undefined;

      // Nếu node có name (thường dùng nhất)
      if (element.businessObject?.name) {
        label = element.businessObject.name;
      }

      // Nếu là label element riêng
      if (!label && element.labels?.length > 0) {
        label = element.labels[0].businessObject.text;
      }

      console.log("Double clicked:", element.id, "Label:", label);
      setElementSec({ ...element, label });
      if (element.type === "bpmn:SequenceFlow" && !element.businessObject.name) {
        const modeling = modeler.get("modeling");
        const directEditing = modeler.get("directEditing");

        // tạo label rỗng để hiển thị input
        modeling.updateLabel(element, "");

        // bật input editing ngay
        setTimeout(() => {
          directEditing.activate(element);
        }, 0);
      } else {
        if (goForm.current) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          goForm.current.openModal();
        }
      }
    });

    const canvas = modeler.get("canvas");

    // highlight khi hover vào
    eventBus.on("element.hover", (e: any) => {
      const element = e.element;
      if (element.type === "bpmn:SequenceFlow") {
        canvas.addMarker(element, "highlight-connection");
      }
    });

    // remove highlight khi out
    eventBus.on("element.out", (e: any) => {
      const element = e.element;
      if (element.type === "bpmn:SequenceFlow") {
        canvas.removeMarker(element, "highlight-connection");
      }
    });

  }

  // Cập nhật label node sau khi submit form
  const handleSubmitFromDrawer = (values: any) => {
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
      return
    }
    setData([...data, infoNode])
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