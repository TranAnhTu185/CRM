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

export type childProps = {
  onSubmit: () => void;
}

export type ChildFormProps = {
  onSubmit: (values: any) => void;
};