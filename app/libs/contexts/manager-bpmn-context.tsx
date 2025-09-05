import { createContext, ReactNode, useContext, useState } from "react";

export type NodeModel = {
    id: string,
    name: string,
    info: string,
    type: string,
    x: number,
    y: number,
    width: number,
    height: number,
    businessObject: any
}

export class ManagerBpmnContextType {
    data: NodeModel[] = []
    setData!: (value: NodeModel[]) => void
}

export const ManagerBpmnContext = createContext<ManagerBpmnContextType>(new ManagerBpmnContextType());

interface IProps {
    children: ReactNode
}

export const ManagerBpmnProvider = ({ children }: IProps) => {
    const [data, setData] = useState<NodeModel[]>([])

    return (
        <ManagerBpmnContext.Provider value={{
            data,
            setData
        }}>
            {children}
        </ManagerBpmnContext.Provider>
    )
}

export const useManagerBpmnContext = () => {
    return useContext(ManagerBpmnContext)
}