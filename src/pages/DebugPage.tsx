import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ChangeEvent, ChangeEventHandler, useState } from "react";

type Response = {
  prompt: string;
  result: any;
};

const DebugPage = () => {
  const [replValue, setValue] = useState("");
  const [responses, setResponses] = useState<Response[]>([
    {
      prompt: "1+1",
      result: 2,
    },
  ]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  };

  const handleSubmit = () => {
    const res = eval(replValue);
    setResponses([
      ...responses,
      {
        prompt: replValue,
        result: res,
      },
    ]);
    setValue("");
  };

  const handleClear = () => {
    setResponses([]);
  };

  return (
    <div className="flex flex-col gap-4">
      <Textarea value={replValue} onChange={handleChange} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <Button type="button" className="grow" onClick={handleSubmit}>
          Submit
        </Button>
        <Button
          type="button"
          className="grow"
          variant="secondary"
          onClick={handleClear}
        >
          Clear Responses
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        {responses.map((response, index) => (
          <Card key={index} className="py-2 px-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <div className="flex flex-col">
                <strong className="text-lg">Prompt</strong>
                {response.prompt.split("\n").map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <div className="flex flex-col grow shrink-0 gap-1">
                <strong className="text-lg">Result</strong>
                <p>{JSON.stringify(response.result)}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export { DebugPage };
