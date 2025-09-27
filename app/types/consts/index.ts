'use client';

import { NodeModel } from "@/app/libs/contexts/manager-bpmn-context";

export interface CustomIcon {
  url: string;
  width: number;
  height: number;
  type: string;
  name: string;
}

export interface CustomIconsType {
  [key: string]: CustomIcon;
}

export interface BpmnViewerProps {
  diagram: string;
  height?: number;
  onDropElement?: (elementType: string, position: { x: number; y: number }) => void;
}

export interface DraggableIconProps {
  iconType: string;
  name: string;
}

export interface BpmnElement {
  id: string;
  type: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ComponentData {
  id: string;
  type: string;
  children?: ComponentData[];
  props: ComponentProps;
}

export interface ComponentProps {
  label?: string;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  defaultValue?: any;

  // Layout props
  showBorder?: boolean;
  visible?: boolean;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  gap?: number;
  columns?: number | string;
  tabOrder?: string;
  tabCount?: number;
  name?: string;
  min?: number;
  max?: number;
  descript?: string;
  allowDecimal?: boolean;
  thousandSeparator?: string;
  decimalScale?: number;
  prefixSuffix?: string;
  prefixSuffixContent?: string;
  typeDateOrTime?: string;
  format?: string;
  listButton?: IButtonGroup[];
  listSelectOption?: IOptionSelect[];


  //câu shinhf button
  type?: string;
  style?: string;
  size?: string;
}

export interface IButtonGroup {
  id: string;
  name?: string;
  type?: string;
  style?: string;
  size?: string;
}

export interface IOptionSelect {
  id: string;
  name?: string;
  value?: string;
  isDefault?: boolean;
}

export type childProps = {
  onSubmit: () => void;
}

export type ChildFormProps = {
  data?: NodeModel;
  dataChildren?: ComponentData[],
  onSubmit: (values: any) => void;
};


export interface GoFormProps {
  elementProp: any;
  data: NodeModel | undefined;
  onSubmit: (values: any) => void;
};

// Kiểu cho ref (những gì bạn expose ra ngoài)
export type GoFormRef = {
  openModal: () => void;
};




export interface ChildPropsBPMN {
    idBP?:string;
    type?: string;
    onButtonClick: (increment: string) => void;
}



//process
export interface Permission {
    id: number;
    type: string;
    include: string;
    user: string;
    role: string;
}

export interface dataItemNode {
    version?: string,
    content?: [],
    name?: string,
    description?: string,
    id?: string,
    created_at?: number,
    permissions?: [],
    type?: string,
    updated_at?: number,
    status?: string,
    publish?: string,
}