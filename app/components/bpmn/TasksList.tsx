'use client';

import BpmnJS from 'bpmn-js/lib/Modeler';
import Image from "next/image";
import UserTask from "../../../public/icon/user-task.svg";
import SendEmail from "../../../public/icon/email-task.svg";
import SendHTTP from "../../../public/icon/http-request-task.svg";
import Organization from "../../../public/icon/organization-task.svg";
import Notification from "../../../public/icon/notification-task.svg";
import Record from "../../../public/icon/record-task.svg";
import GetRecord from "../../../public/icon/get-record-task.svg";
import Loop from "../../../public/icon/loop-task.svg";
import PhoneCall from "../../../public/icon/phone-call-task.svg";

import Exclusive from "../../../public/icon/exclusive-gateway.svg";
import Inclusive from "../../../public/icon/inclusive-gateway.svg";
import Parallel from "../../../public/icon/parallel-gateway.svg";

import Wait from "../../../public/icon/wait-task.svg";
import Ends from "../../../public/icon/end-event.svg";
import Start from "../../../public/icon/start-event.svg";
export default function BpmnSidebar({ modeler }: { modeler: BpmnJS | null }) {
  if (!modeler) {
    return <div className="w-64 p-3 border-r h-screen">Đang tải...</div>;
  }

  const elementFactory = modeler.get('elementFactory');
  const create = modeler.get('create');

  // tạo shape như cũ
  function startCreate(event: React.MouseEvent, type: string, label: string) {
    const shape = elementFactory.createShape({
      type,
      width: 62,
      height: 62
    });

    if (label) {
      shape.businessObject.name = label;
    }

    create.start(event as any, shape);
  }

  modeler.get("eventBus").on('create.end', (e: any) => {
    const createdShape = e.context.shape;
    console.log(createdShape);
  });


  const addLoopTask = (event: React.MouseEvent, type: string, label: string, key: string) => {
    if (!modeler) return;

    const elementFactory = modeler.get('elementFactory');
    const moddle = modeler.get('moddle');

    // Tạo shape
    const taskShape = elementFactory.createShape({
      type,              // ví dụ 'bpmn:UserTask'
      width: 62,
      height: 62
    });

    // ✅ set label sau khi tạo
    if (label) {
      taskShape.businessObject.name = label;
    }


    // Tạo extensionElements nếu chưa có
    if (!taskShape.businessObject.extensionElements) {
      taskShape.businessObject.extensionElements = moddle.create('bpmn:ExtensionElements', { values: [] });
    }

    // Tạo elementInfo
    const elementInfo = moddle.create('configEx:elementInfo', { renderKey: key });
    taskShape.businessObject.elementInfo = elementInfo;


    create.start(event as unknown as any, taskShape);
    // Thêm vào canvas
    // modeling.createShape(taskShape, { x: 200, y: 150 }, elementRegistry.get('BlankProcess'));
  };


  const handleExport = async () => {
    if (!modeler) return;

    const elementRegistry = modeler.get('elementRegistry');
    const modeling = modeler.get('modeling');

    elementRegistry.filter((el: any) => el.type === 'bpmn:SequenceFlow').forEach((flow: any) => {
      if (!flow.source || !flow.target) {
        modeling.removeElements([flow]);
      }
    });

    try {
      const { xml } = await modeler.saveXML({ format: true });
      console.log('Exported BPMN XML:', xml);
    } catch (err) {
      console.error('Error exporting XML:', err);
    }
  };

  return (
    <div className="w-[320px] h-full py-4 rounded border border-gray-200 text-black mr-6">
      <button
        className="text-left px-4 py-2 hover:bg-primary-light-90 flex items-center gap-2 bpmn-icon-user-task-custom"
        onClick={handleExport}
      >
        <Image
          src={UserTask}
          alt=""
          className="w-7 h-7 "
        />
        <span className='prose-body2 text-typo-primary'>Save</span>
      </button>
      <h4 className="font-bold px-4 py-2 mb-2">Tasks</h4>
      <button
        className="text-left px-4 py-2 hover:bg-primary-light-90 flex items-center gap-2 bpmn-icon-user-task-custom"
        onMouseDown={(e) => startCreate(e, 'bpmn:UserTask', 'User Task')}
      >
        <Image
          src={UserTask}
          alt=""
          className="w-7 h-7 "
        />
        <span className='prose-body2 text-typo-primary'>User task</span>
      </button>

      <button
        className="text-left px-4 py-2 hover:bg-primary-light-90 flex items-center gap-2 bpmn-icon-user-task-custom text-black"
        onMouseDown={(e) => startCreate(e, 'bpmn:SendTask', 'Send mail')}
      >
        <Image
          src={SendEmail}
          alt=""
          className="w-7 h-7 "
        />
        <span className='prose-body2 text-typo-primary'>Send Email</span>
      </button>

      <button
        className="text-left px-4 py-2 hover:bg-primary-light-90 flex items-center gap-2 bpmn-icon-user-task-custom text-black"
        onMouseDown={(e) => addLoopTask(e, 'elEx:HttpTask', 'Send HTTP Request', 'SEND_HTTP_TASK')}
      >
        <Image
          src={SendHTTP}
          alt=""
          className="w-7 h-7 "
        />
        <span className='prose-body2 text-typo-primary'>Send HTTP Request</span>
      </button>

      <button
        className="text-left px-4 py-2 hover:bg-primary-light-90 flex items-center gap-2 bpmn-icon-user-task-custom text-black"
        onMouseDown={(e) => addLoopTask(e, 'elEx:OrganizationTask', 'Origanzation', 'ORGANIZATION_TASK')}
      >
        <Image
          src={Organization}
          alt=""
          className="w-7 h-7 "
        />
        <span className='prose-body2 text-typo-primary'>Origanzation</span>
      </button>
      <button
        className="text-left px-4 py-2 hover:bg-primary-light-90 flex items-center gap-2 bpmn-icon-user-task-custom text-black"
        onMouseDown={(e) => addLoopTask(e, 'elEx:SendNotificationTask', 'Send Notification', 'SEND_NOTIFICATION_TASK')}
      >
        <Image
          src={Notification}
          alt=""
          className="w-7 h-7 "
        />
        <span className='prose-body2 text-typo-primary'>Send Notification</span>
      </button>
      <button
        className="text-left px-4 py-2 hover:bg-primary-light-90 flex items-center gap-2 bpmn-icon-user-task-custom text-black"
        onMouseDown={(e) => addLoopTask(e, 'elEx:CreateRecordTask', 'Crate and Update Record', 'CREATE_RECORD_TASK')}
      >
        <Image
          src={Record}
          alt=""
          className="w-7 h-7 "
        />
        <span className='prose-body2 text-typo-primary'>Crate and Update Record</span>
      </button>
      <button
        className="text-left px-4 py-2 hover:bg-primary-light-90 flex items-center gap-2 bpmn-icon-user-task-custom text-black"
        onMouseDown={(e) => addLoopTask(e, 'elEx:GetRecordTask', 'Get Record', 'GET_RECORD_TASK')}
      >
        <Image
          src={GetRecord}
          alt=""
          className="w-7 h-7 "
        />
        <span className='prose-body2 text-typo-primary'>Get Record</span>
      </button>
      <button
        className="text-left px-4 py-2 hover:bg-primary-light-90 flex items-center gap-2 bpmn-icon-user-task-custom text-black"
        // onMouseDown={(e) => startCreate(e, )}
        onMouseDown={(e) => addLoopTask(e, 'elEx:LoopTask', 'Loop', 'LOOP_TASK')}
      >
        <Image
          src={Loop}
          alt=""
          className="w-7 h-7 "
        />
        <span className='prose-body2 text-typo-primary'>Loop</span>
      </button>
      <button
        className="text-left px-4 py-2 hover:bg-primary-light-90 flex items-center gap-2 bpmn-icon-user-task-custom text-black"
        onMouseDown={(e) => startCreate(e, 'bpmn:ServiceTask', 'Phone Call')}
      >
        <Image
          src={PhoneCall}
          alt=""
          className="w-7 h-7 "
        />
        <span className='prose-body2 text-typo-primary'>Phone Call</span>
      </button>

      <h4 className="font-bold px-4 py-2 mb-2">Gateways</h4>
      <button
        className="text-left px-4 py-2 hover:bg-primary-light-90 flex items-center gap-2 bpmn-icon-user-task-custom text-black"
        onMouseDown={(e) => startCreate(e, 'bpmn:ExclusiveGateway', 'Exclusive gateway')}
      >
        <Image
          src={Exclusive}
          alt=""
          className="w-7 h-7 "
        />
        <span className='prose-body2 text-typo-primary'>Exclusive gatewway</span>
      </button>
      <button
        className="text-left px-4 py-2 hover:bg-primary-light-90 flex items-center gap-2 bpmn-icon-user-task-custom text-black"
        onMouseDown={(e) => startCreate(e, 'bpmn:InclusiveGateway', 'Inclusive gateway')}
      >
        <Image
          src={Inclusive}
          alt=""
          className="w-7 h-7 "
        />
        <span className='prose-body2 text-typo-primary'>Inclusive gatewway</span>
      </button>
      <button
        className="text-left px-4 py-2 hover:bg-primary-light-90 flex items-center gap-2 bpmn-icon-user-task-custom text-black"
        onMouseDown={(e) => startCreate(e, 'bpmn:ParallelGateway', 'Parallel gateway')}
      >
        <Image
          src={Parallel}
          alt=""
          className="w-7 h-7 "
        />
        <span className='prose-body2 text-typo-primary'>Parallel gatewway</span>
      </button>

      <h4 className="font-bold px-4 py-2 mb-2">Events</h4>
      <button
        className="text-left px-4 py-2 hover:bg-primary-light-90 flex items-center gap-2 bpmn-icon-user-task-custom text-black"
        onMouseDown={(e) => addLoopTask(e, 'elEx:WaitTask', 'Wait', 'WAIT_TASK')}
      >
        <Image
          src={Wait}
          alt=""
          className="w-7 h-7 "
        />
        <span className='prose-body2 text-typo-primary'>Wait</span>
      </button>
      <button
        className="text-left px-4 py-2 hover:bg-primary-light-90 flex items-center gap-2 bpmn-icon-user-task-custom text-black"
        onMouseDown={(e) => startCreate(e, 'bpmn:EndEvent', 'Ends')}
      >
        <Image
          src={Ends}
          alt=""
          className="w-7 h-7 "
        />
        <span className='prose-body2 text-typo-primary'>Ends</span>
      </button>

      <button
        className="text-left px-4 py-2 hover:bg-primary-light-90 flex items-center gap-2 bpmn-icon-user-task-custom text-black"
        onMouseDown={(e) => startCreate(e, 'bpmn:StartEvent', 'Start')}
      >
        <Image
          src={Start}
          alt=""
          className="w-7 h-7 "
        />
        <span className='prose-body2 text-typo-primary'>Start</span>
      </button>
    </div>
  );
}
