import { HTMLAttributes, ReactNode } from "react";

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
     children: ReactNode;
     menuVisible: boolean;
     triggerClasses: string[]; 
}