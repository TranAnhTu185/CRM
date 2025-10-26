// import { Suspense } from "react"
// import CreateProcess from "./CreateProcessPage"

import { FlowOption } from "@/app/(main)/types/consts";
import CreateProcess from "./CreateProcessPage";
import { IconBolt, IconCalendar, IconDeviceDesktop, IconPlaylist } from "@tabler/icons-react";

// export default function Page({
//   searchParams,
// }: {
//   searchParams: { type?: string }
// }) {
//   return (
//    <Suspense fallback={<>...</>}>
//       <CreateProcess type={searchParams?.type ?? ""} />
//     </Suspense>
//   )
// }



interface PageCreateProps {
    params: Promise<{
        type: string;
    }>;
}

// ✅ Chạy ở build-time (hoặc export) để sinh static params
export async function generateStaticParams() {
    const flowOptions: FlowOption[] = [
        {
            type: "manual",
            title: "Manual Flow - Quy trình thông thường",
            description:
                "Cho phép người dùng thực hiện từng bước bằng cách nhập dữ liệu vào các màn hình đã cấu hình sẵn, sau đó chuyển tiếp các bước khác theo thiết lập.",
            icon: <IconDeviceDesktop size={28} />,
            color: "blue",
        },
        {
            type: "scheduled",
            title: "Scheduled Flow - Quy trình tự động theo thời gian",
            description:
                "Khởi chạy theo lịch trình và tần suất được thiết lập trước, đảm bảo quy trình diễn ra đúng thời điểm.",
            icon: <IconCalendar size={28} />,
            color: "green",
        },
        {
            type: "triggered",
            title: "Triggered Flow - Quy trình tự động theo điều kiện",
            description:
                "Khởi chạy khi đáp ứng điều kiện nhất định, giúp kích hoạt và thực hiện các công việc tiếp theo trong quy trình một cách tự động.",
            icon: <IconBolt size={28} />,
            color: "orange",
        },
        {
            type: "sequence",
            title: "Sequence - Chuỗi hành động",
            description:
                "Thực hiện lần lượt các bước theo trình tự đã thiết lập, cho phép gán người phụ trách và điều kiện chuyển bước nhằm đảm bảo quy trình diễn ra đúng kế hoạch.",
            icon: <IconPlaylist size={28} />,
            color: "violet",
        },
    ];

    return flowOptions.map((item: FlowOption) => ({
        type: item.type,
    }));
}

export default async function ProcessDetailPage({ params }: PageCreateProps) {
    const { type } = await params;
    return <CreateProcess type={type} />;
}

