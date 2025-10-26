'use client';
declare module "bpmn-js/lib/Modeler" {
  import Modeler from "bpmn-js/lib/Modeler";

  export default Modeler;
}

declare module "bpmn-js/lib/Modeler" {
  interface BpmnModeler {
    get(service: string): any;
  }
}
