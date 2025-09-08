'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import BpmnJS, { BpmnModeler } from 'bpmn-js/lib/Modeler';
import CustomRenderer from './CustomRenderer';
import ContextMenu from './menu-right-click/ContextMenu';
import elExModdle from './jsons/elEx-moddle.json';
import configExModdle from './jsons/configEx-moddle.json';
import GoForm from '@/app/components/form/page';
import labelEditingProviderModule from "bpmn-js/lib/features/label-editing";
import "./css/style.css";
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
  const [modeler, setModeler] = useState<BpmnJS | null>(null);
  const [menu, setMenu] = useState<{ x: number, y: number, elementId: string } | null>(null);
  const modelerRef = useRef<BpmnModeler>(null);
  const [connectMode, setConnectMode] = useState(false);

  const [connectingNode, setConnectingNode] = useState<any>(null);

  //draw form 
  const [elementSec, setElementSec] = useState<any>(null);
  const goForm = useRef(null);

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
          labelEditingProvider: ['value', null],
          paletteProvider: ["value", null],
          labelEditingProviderModule
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
    //event connect node when clik
    modeler.get('eventBus').off('element.click'); // clear trước để tránh double bind
    if (connectMode) {
      modeler.get('eventBus').on('element.click', (e: any) => {
        const element = e.element;
        // bỏ qua click vào diagram/background
        if (!element || element.type === 'bpmn:Process') return;
        if (element.type === "bpmn:SequenceFlow") {
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

  }

  const removeOutline = () => {
    const overlays = modeler.get('overlays');
    const elementRegistry = modeler.get('elementRegistry');
    elementRegistry.getAll().forEach((el: any) => {
      const gfx = elementRegistry.getGraphics(el);
      gfx.classList.remove('custom-highlight');
    });
    overlays.clear();
  }


  const handleSubmitFromDrawer = (values: any) => {
    const modeler = modelerRef.current;
    if (!modeler) return;

    const elementRegistry = modeler.get("elementRegistry");
    const modeling = modeler.get("modeling");
  if (modeler) {
    //event connect node when clik
    modeler.get('eventBus').off('element.click'); // clear trước để tránh double bind
    if (connectMode) {
      modeler.get('eventBus').on('element.click', (e: any) => {
        const element = e.element;
        // bỏ qua click vào diagram/background
        if (!element || element.type === 'bpmn:Process') return;

        const modeling = modeler!.get('modeling');
        const elementRegistry = modelerRef.current!.get('elementRegistry');
        const source = elementRegistry.get(connectingNode);
        modeling.connect(source, element, {
          type: 'bpmn:SequenceFlow',
        });
        setConnectingNode(null); // reset sau khi nối xong
        setConnectMode(false); // tắt connect mode
        removeOutline();
      });

      modeler.get('eventBus').on('connect.end', (e: any) => {
        const { source, target, connection } = e.context;

        if (target) {
          removeOutline();
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
      if (goForm.current) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        goForm.current.openModal();
      }
    });

  }

  // Cập nhật label node sau khi submit form
  const handleSubmitFromDrawer = (values: any) => {
    console.log('andn')
    if (!modelerRef.current || !elementSec) return;
    const elementRegistry = modelerRef.current.get('elementRegistry');
    const modeling = modelerRef.current.get('modeling');
    const element = elementRegistry.get(elementSec.id);
    if (element) {
      modeling.updateLabel(element, values.name);
    }
  };


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
    <Suspense fallback={<div></div>}>
      <GoForm ref={goForm} elementProp={elementSec} onSubmit={handleSubmitFromDrawer}></GoForm>
    </Suspense>
  </div>;
}
