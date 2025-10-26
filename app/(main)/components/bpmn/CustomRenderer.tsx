'use client';

import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import { append as svgAppend, create as svgCreate, attr as svgAttr } from 'tiny-svg';
import { is } from 'bpmn-js/lib/util/ModelUtil';

const HIGH_PRIORITY = 1500;

export default class CustomRenderer extends BaseRenderer {
    static $inject = ['eventBus', 'bpmnRenderer'];

    private bpmnRenderer: any;

    constructor(eventBus: any, bpmnRenderer: any) {
        super(eventBus, HIGH_PRIORITY);
        this.bpmnRenderer = bpmnRenderer;
    }

    canRender(element: any) {
        if (element.labelTarget) return false;

        return is(element, 'bpmn:Task')
            || is(element, 'bpmn:StartEvent')
            || is(element, 'bpmn:EndEvent')
            || is(element, 'bpmn:SubProcess')
            || is(element, 'bpmn:ExclusiveGateway')
            || is(element, 'bpmn:InclusiveGateway')
            || is(element, 'bpmn:ParallelGateway');
    }

    drawShape(parentNode: SVGElement, element: any) {
        if (element.type === 'bpmn:UserTask') {
            if (element.businessObject) {
                this.addCustomLabel(parentNode, element);
            }
            const icon = svgCreate('image');
            svgAttr(icon, {
                href: "/icon/user-task.svg",
                x: 1,
                y: 1,
                width: 60,
                height: 60
            });
            svgAppend(parentNode, icon);

            return icon;
        } else if (element.type === 'bpmn:SendTask') {
            if (element.businessObject) {
                this.addCustomLabel(parentNode, element);
            }
            const icon = svgCreate('image');
            svgAttr(icon, {
                href: "/icon/email-task.svg",
                x: 1,
                y: 1,
                width: 60,
                height: 60
            });
            svgAppend(parentNode, icon);

            return icon;
        } else if (element.type === 'elEx:HttpTask') {
            if (element.businessObject) {
                this.addCustomLabel(parentNode, element);
            }
            const icon = svgCreate('image');
            svgAttr(icon, {
                href: "/icon/http-request-task.svg",
                x: 1,
                y: 1,
                width: 60,
                height: 60
            });
            svgAppend(parentNode, icon);

            return icon;
        }
        else if (element.type === 'elEx:OrganizationTask') {
            if (element.businessObject) {
                this.addCustomLabel(parentNode, element);
            }
            const icon = svgCreate('image');
            svgAttr(icon, {
                href: "/icon/organization-task.svg",
                x: 1,
                y: 1,
                width: 60,
                height: 60
            });
            svgAppend(parentNode, icon);

            return icon;
        }
        else if (element.type === 'elEx:SendNotificationTask') {
            if (element.businessObject) {
                this.addCustomLabel(parentNode, element);
            }
            const icon = svgCreate('image');
            svgAttr(icon, {
                href: "/icon/notification-task.svg",
                x: 1,
                y: 1,
                width: 60,
                height: 60
            });
            svgAppend(parentNode, icon);

            return icon;
        }
        else if (element.type === 'elEx:CreateRecordTask') {
            if (element.businessObject) {
                this.addCustomLabel(parentNode, element);
            }
            const icon = svgCreate('image');
            svgAttr(icon, {
                href: "/icon/record-task.svg",
                x: 1,
                y: 1,
                width: 60,
                height: 60
            });
            svgAppend(parentNode, icon);

            return icon;
        }
        else if (element.type === 'elEx:GetRecordTask') {
            if (element.businessObject) {
                this.addCustomLabel(parentNode, element);
            }
            const icon = svgCreate('image');
            svgAttr(icon, {
                href: "/icon/get-record-task.svg",
                x: 1,
                y: 1,
                width: 60,
                height: 60
            });
            svgAppend(parentNode, icon);

            return icon;
        }
        else if (element.type === 'elEx:LoopTask') {
            if (element.businessObject) {
                this.addCustomLabel(parentNode, element);
            }
            const icon = svgCreate('image');
            svgAttr(icon, {
                href: "/icon/loop-task.svg",
                x: 1,
                y: 1,
                width: 60,
                height: 60
            });
            svgAppend(parentNode, icon);

            return icon;
        }
        else if (element.type === 'bpmn:ExclusiveGateway') {
            const icon = svgCreate('image');
            svgAttr(icon, {
                href: "/icon/exclusive-gateway.svg",
                x: 1,
                y: 1,
                width: 60,
                height: 60
            });
            svgAppend(parentNode, icon);

            return icon;
        }
        else if (element.type === 'bpmn:InclusiveGateway') {
            const icon = svgCreate('image');
            svgAttr(icon, {
                href: "/icon/inclusive-gateway.svg",
                x: 1,
                y: 1,
                width: 60,
                height: 60
            });
            svgAppend(parentNode, icon);

            return icon;
        } else if (element.type === 'bpmn:ParallelGateway') {
            const icon = svgCreate('image');
            svgAttr(icon, {
                href: "/icon/parallel-gateway.svg",
                x: 1,
                y: 1,
                width: 60,
                height: 60
            });
            svgAppend(parentNode, icon);

            return icon;
        } else if (element.type === 'elEx:WaitTask') {
            if (element.businessObject) {
                this.addCustomLabel(parentNode, element);
            }
            const icon = svgCreate('image');
            svgAttr(icon, {
                href: "/icon/wait-task.svg",
                x: 1,
                y: 1,
                width: 60,
                height: 60
            });
            svgAppend(parentNode, icon);

            return icon;
        } else if (element.type === 'bpmn:EndEvent') {
            const icon = svgCreate('image');
            svgAttr(icon, {
                href: "/icon/end-event.svg",
                x: 1,
                y: 1,
                width: 60,
                height: 60
            });
            svgAppend(parentNode, icon);

            return icon;
        }
        else if (element.type === 'bpmn:StartEvent') {
            const icon = svgCreate('image');
            svgAttr(icon, {
                href: "/icon/start-event.svg",
                x: 1,
                y: 1,
                width: 60,
                height: 60
            });
            svgAppend(parentNode, icon);

            return icon;
        } else {
            if (element.businessObject) {
                this.addCustomLabel(parentNode, element);
            }
            const icon = svgCreate('image');
            svgAttr(icon, {
                href: "/icon/phone-call-task.svg",
                x: 1,
                y: 1,
                width: 60,
                height: 60
            });
            svgAppend(parentNode, icon);

            return icon;
        }

        // fallback → dùng renderer mặc định
        return this.bpmnRenderer.drawShape(parentNode, element);
    }


    addCustomLabel(parentNode: SVGElement, element: any) {
        const { width, height } = element;
        const text = element.businessObject.name || '';

        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.textContent = text;

        // canh giữa dưới node
        label.setAttribute('x', String(width / 2));
        label.setAttribute('y', String(height + 20));
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('dominant-baseline', 'hanging');
        label.setAttribute('font-size', '12');
        label.setAttribute('font-family', 'Arial, sans-serif');

        parentNode.appendChild(label);
    }

    drawConnection(parentNode: SVGElement, element: any) {
        return this.bpmnRenderer.drawConnection(parentNode, element);
    }
}
