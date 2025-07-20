import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";

export default function FieldRow({ field, onChange, onDelete, onAddNested, renderChildren }) {
  return (
    <Card className="p-4 space-y-2">
      <div className="flex gap-2 items-center">
        <Input
          placeholder="Field name"
          value={field.key}
          onChange={(e) => onChange(field.id, { key: e.target.value })}
        />
        <Select
          value={field.type}
          onValueChange={(val) => onChange(field.id, { type: val })}
        >
          <SelectItem value="string">String</SelectItem>
          <SelectItem value="number">Number</SelectItem>
          <SelectItem value="float">Float</SelectItem>
          <SelectItem value="boolean">Boolean</SelectItem>
          <SelectItem value="objectId">ObjectId</SelectItem>
          <SelectItem value="array">Array</SelectItem>
          <SelectItem value="nested">Nested</SelectItem>
        </Select>
        <Button variant="destructive" onClick={() => onDelete(field.id)}>Delete</Button>
        {field.type === "nested" && (
          <Button onClick={() => onAddNested(field.id)}>+ Nested</Button>
        )}
      </div>
      {field.type === "nested" && field.children?.length > 0 && (
        <div className="pl-6 border-l mt-2 space-y-2">
          {renderChildren(field.children, field.id)}
        </div>
      )}
    </Card>
  );
}
