// // lib/CustomPaletteProvider.ts
// export default class CustomPaletteProvider {
//   private bpmnFactory: any;
//   private create: any;
//   private elementFactory: any;
//   private translate: any;

//   static $inject = ["bpmnFactory", "create", "elementFactory", "palette", "translate"];

//   constructor(
//     bpmnFactory: any,
//     create: any,
//     elementFactory: any,
//     palette: any,
//     translate: any
//   ) {
//     this.bpmnFactory = bpmnFactory;
//     this.create = create;
//     this.elementFactory = elementFactory;
//     this.translate = translate;

//     // đăng ký provider với palette
//     palette.registerProvider(this);
//   }

//   getPaletteEntries() {
//     const { create, elementFactory, translate } = this;

//     return {
//       "create.start-event": {
//         group: "event",
//         className: "bpmn-icon-start-event-none",
//         title: translate("Start Event"),
//         action: {
//           dragstart: (event: any) => {
//             const shape = elementFactory.createShape({ type: "bpmn:StartEvent" });
//             create.start(event, shape);
//           },
//           click: (event: any) => {
//             const shape = elementFactory.createShape({ type: "bpmn:StartEvent" });
//             create.start(event, shape);
//           },
//         },
//       },
//       "create.end-event": {
//         group: "event",
//         className: "bpmn-icon-end-event-none",
//         title: translate("End Event"),
//         action: {
//           dragstart: (event: any) => {
//             const shape = elementFactory.createShape({ type: "bpmn:EndEvent" });
//             create.start(event, shape);
//           },
//           click: (event: any) => {
//             const shape = elementFactory.createShape({ type: "bpmn:EndEvent" });
//             create.start(event, shape);
//           },
//         },
//       },
//       "create.custom-task": {
//         group: "activity",
//         className: "bpmn-icon-task",
//         title: translate("Custom Task"),
//         action: {
//           dragstart: (event: any) => {
//             const shape = elementFactory.createShape({ type: "bpmn:Task" });
//             create.start(event, shape);
//           },
//           click: (event: any) => {
//             const shape = elementFactory.createShape({ type: "bpmn:Task" });
//             create.start(event, shape);
//           },
//         },
//       },
//     };
//   }
// }
