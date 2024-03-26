import { api } from "@/utils/api";
import { toast } from 'sonner'
import { useEffect, useState } from "react";
import BackButton from "@/components/BackButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { DownloadIcon, XIcon } from "lucide-react";

export default function Post() {
    const generateImageApi = api.gen.genImage.useMutation();
    const [imagefile, setImagefile] = useState<File>();
    const [scale, setScale] = useState<number>(0.8);
    const [rotate, setRotate] = useState<number>(0);
    const [keyInput, setKeyInput] = useState<number>(0);
    const onGenerate = () => {
        const key = toast.loading('Generating...');
        const reader = new FileReader();
        reader.readAsDataURL(imagefile!);
        reader.onload = () => {
            if (!reader.result) {
                return;
            }
            generateImageApi.mutate({
                imagefile: (reader.result as string),
                scale: scale,
                rotate: rotate * -1
            }, {
                onSuccess: () => {
                    toast.success('Generated!', { id: key });
                },
                onError: (e) => {
                    toast.error('Error!', { id: key });
                    console.error(e);
                }
            });
        }
    }

    const onDownloadImage = () => {
        const key = toast.loading('Downloading...');
        if (generateImageApi.data) {
            const link = document.createElement('a');
            link.href = generateImageApi.data.image;
            link.download = `post-${new Date().getTime()}.png`;
            toast.success('Downloaded!', { id: key });
            link.click();
        }
    }

    const onClear = () => {
        setKeyInput(pre => pre + 1);
        setImagefile(undefined);
        generateImageApi.reset();
    }

    return (
        <div className="max-w-2xl mx-auto p-5">
            <BackButton />
            <Card>
                <CardHeader>
                    <CardTitle>Instagram Story</CardTitle>
                    <CardDescription>Create for Instagram Story</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                    {generateImageApi.data ? <div className="flex flex-col gap-2">
                        <Button disabled={generateImageApi.isPending} onClick={onDownloadImage} className="gap-3" size={"lg"}><DownloadIcon size={15} /> Download</Button>
                        <Button disabled={!generateImageApi.data} onClick={onClear} className="gap-3" size={"lg"}><XIcon size={15} /> Clear</Button>
                        <div className="flex flex-col">
                            <div className="flex gap-2 items-center">
                                <div className="font-bold">Size :</div>
                                <div>{generateImageApi.data.size.wieght}x{generateImageApi.data.size.height}</div>
                            </div>
                            {/* <div className="flex gap-2 items-center">
                                <div className="font-bold">Camera :</div>
                                <div>{generateImageApi.data.exif.Model} @{generateImageApi.data.exif.FocalLengthIn35mmFormat ?? generateImageApi.data.exif.FocalLength}</div>
                            </div> */}
                        </div>
                        <div className="border">
                            <img className="" src={generateImageApi.data.image} alt="" />
                        </div>
                    </div> : <></>}

                    <>
                        <Input key={keyInput} type="file" onChange={(e) => setImagefile(e.target.files?.[0])} />
                        <div className="flex gap-5 items-center">
                            <div className="w-fit">{scale.toFixed(2)}</div>
                            <Slider defaultValue={[0.8]} max={2} step={0.1} onValueChange={(v) => setScale(v[0] as number)} />
                        </div>
                        <div className="flex gap-5 items-center">
                            <div className="w-10">{rotate} </div>
                            <Slider defaultValue={[0]} max={360} min={-360} step={90} onValueChange={(v) => setRotate(v[0] as number)} />
                        </div>
                        <Button disabled={generateImageApi.isPending} onClick={onGenerate} >สร้าง</Button>
                    </>
                </CardContent>
            </Card>
        </div>
    );
}
