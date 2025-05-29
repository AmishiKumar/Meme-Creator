
export interface TextElement {
  id: string;
  text: string;
  x: number; // percentage
  y: number; // percentage
  fontSize: number;
  fontFamily: string;
  color: string;
  strokeColor: string;
  strokeWidth: number;
}

export interface MemeTemplate {
  id: string;
  name: string;
  url: string;
  category: string;
}
