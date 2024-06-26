import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function Index() {
    const { push } = useRouter()
    return (
        <div className="max-w-2xl mx-auto min-h-screen py-5 px-3">
            <div className="flex flex-col gap-3">
                <div className="text-xl font-bold">Generate Image</div>
                {/* <Button onClick={()=>push("/story")} size={"lg"} colorScheme="blue" className="w-full">
                    Instagram Story
                </Button>
                <Button  size={"lg"} colorScheme="blue" className="w-full">
                    Instagram Post
                </Button> */}
                <Button onClick={()=>push("/story")} className="font-bold">Instagram Story</Button>
                <Button onClick={()=>push("/post")} className="font-bold">Instagram Post</Button>
            </div>
        </div>
    )
}