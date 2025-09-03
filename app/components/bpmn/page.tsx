'use client';

import { useState } from 'react';
import BpmnJS from 'bpmn-js/lib/Modeler';
import BpmnSidebar from './TasksList';
import BpmnCanvas from './bpmnModeler';
import { ManagerBpmnProvider } from '@/app/libs/contexts/manager-bpmn-context';

export default function BPMN() {
  const [modeler, setModeler] = useState<BpmnJS | null>(null);

  return (
    <ManagerBpmnProvider>
      <main className="flex w-full h-full items-start">
        <BpmnSidebar modeler={modeler} />
        <BpmnCanvas onModelerReady={setModeler} />
      </main>
    </ManagerBpmnProvider>
  );
}
