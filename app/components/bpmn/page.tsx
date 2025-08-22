'use client';

import { useState } from 'react';
import BpmnJS from 'bpmn-js/lib/Modeler';
import BpmnSidebar from './TasksList';
import BpmnCanvas from './bpmnModeler';

export default function BPMN() {
  const [modeler, setModeler] = useState<BpmnJS | null>(null);

  return (
    <main className="flex w-full h-screen">
      <BpmnSidebar modeler={modeler} />
      <BpmnCanvas onModelerReady={setModeler} />
    </main>
  );
}
