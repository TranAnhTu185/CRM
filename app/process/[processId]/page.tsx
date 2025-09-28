import { DetailAndCreatePage } from "./DetailAndCreatePageClient";


interface PageProps {
  params: Promise<{
    processId: string;
  }>;
}

// ✅ Chạy ở build-time (hoặc export) để sinh static params
export async function generateStaticParams() {
    const url = "https://workflow.bytebuffer.co/workflow"
    try {
        const response = await fetch(url, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers:
            {
                'Content-Type': "application/json"
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
        }

        const dataOpen = await response.json();
        if (dataOpen.rd === "Success") {
            debugger;
            const data = dataOpen.data;

            return data.map((item: any) => ({
                processId: item.id,
            }));
        }
    } catch (error) {
        console.error('Error during fetch:', error);
        throw error; // Re-throw the error for further handling
    }
}

export default async function ProcessDetailPage({ params }: PageProps) {
    const { processId } = await params; 
    return <DetailAndCreatePage processId={processId} />;
}
