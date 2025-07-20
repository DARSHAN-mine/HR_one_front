import { useState } from "react";
import FieldRow from "./FieldRow.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { v4 as uuidv4 } from "uuid";

const defaultField = () => ({ id: uuidv4(), key: "", type: "string", children: [] });

export default function SchemaBuilder() {
  const [schema, setSchema] = useState([defaultField()]);

  const handleFieldChange = (id, field) => {
    const update = (fields) =>
      fields.map((f) => {
        if (f.id === id) return { ...f, ...field };
        if (f.type === "nested" && f.children) {
          return { ...f, children: update(f.children) };
        }
        return f;
      });
    setSchema(update(schema));
  };

  const handleAddField = (parentId = null) => {
    const newField = defaultField();
    if (!parentId) return setSchema([...schema, newField]);

    const addNested = (fields) =>
      fields.map((f) => {
        if (f.id === parentId) {
          return {
            ...f,
            children: [...(f.children || []), newField],
          };
        }
        if (f.type === "nested" && f.children) {
          return { ...f, children: addNested(f.children) };
        }
        return f;
      });
    setSchema(addNested(schema));
  };

  const handleDeleteField = (id) => {
    const remove = (fields) =>
      fields
        .filter((f) => f.id !== id)
        .map((f) =>
          f.type === "nested"
            ? { ...f, children: remove(f.children || []) }
            : f
        );
    setSchema(remove(schema));
  };

  const renderFields = (fields, parentId = null) => (
    <div className="space-y-4">
      {fields.map((field) => (
        <FieldRow
          key={field.id}
          field={field}
          onChange={handleFieldChange}
          onDelete={handleDeleteField}
          onAddNested={handleAddField}
          renderChildren={renderFields}
        />
      ))}
      {!parentId && (
        <Button onClick={() => handleAddField()}>+ Add Field</Button>
      )}
    </div>
  );

  const buildJson = (fields) => {
    const obj = {};
    fields.forEach((f) => {
      if (f.type === "nested") {
        obj[f.key || ""] = buildJson(f.children || []);
      } else {
        switch (f.type) {
          case "string": obj[f.key || ""] = "STRING"; break;
          case "number": obj[f.key || ""] = "number"; break;
          case "float": obj[f.key || ""] = "float"; break;
          case "boolean": obj[f.key || ""] = "boolean"; break;
          case "objectId": obj[f.key || ""] = "ObjectId()"; break;
          case "array": obj[f.key || ""] = []; break;
          default: obj[f.key || ""] = null;
        }
      }
    });
    return obj;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Schema Builder</h2>
        {renderFields(schema)}
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-bold">JSON Output</h2>
        <Textarea
          readOnly
          value={JSON.stringify(buildJson(schema), null, 2)}
          rows={25}
        />
      </div>
    </div>
  );
}