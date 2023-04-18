import { DefaultPageLayout } from "@/components/templates/default-layout";

export default function Inventory() {
  return (
    <div className="App">
      <DefaultPageLayout title="Inventary">
        <div className=" h-96 w-96 rounded border border-[#363636] p-5"></div>
      </DefaultPageLayout>
    </div>
  );
}
