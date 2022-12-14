import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type StatusDocument = StatusProject & Document

@Schema()
export class StatusProject {
    @Prop()
    name: string

    @Prop()
    status: string
}

export const StatusSchema = SchemaFactory.createForClass(StatusProject)