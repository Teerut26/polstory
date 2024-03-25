import { Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

interface Props {
    id?: string
}

export default function BackButton(props: Props) {
    const { back } = useRouter();
    return (
        <div className="flex justify-start">
            <Button onClick={() => back()} size={"lg"} variant='link' colorScheme="blue" >BackButton</Button>
        </div>
    )
}