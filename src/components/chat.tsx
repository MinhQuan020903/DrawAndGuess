import { TbSend } from "react-icons/tb";
export default function ChatComponent() {
  return (
    <div className="flex grow flex-col">
      <h1 className="bg-black p-2">Ribble Chat</h1>
      <ul className="grow overflow-y-auto flex flex-col bg-slate-700 p-2">
        <li>xyz: test</li>
      </ul>
      <div className="flex flex-row">
        <input
          className="text-black rounded-bl-md p-2 grow"
          placeholder="Enter message"
        ></input>
        <button className="bg-green-600 rounded-br-md p-2"><TbSend/></button>
      </div>
    </div>
  );
}
