import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ChevronLeftIcon } from "lucide-react";

export default function BackButton() {
    const { back } = useRouter();
    return (
        <div className="flex justify-start items-center">
            <Button onClick={back} size={"lg"} variant='link'><ChevronLeftIcon /> BackButton</Button>
        </div>
    )
}