import Head from "next/head";
import Link from "next/link";

import { api } from "@/utils/api";
import { Button, Card, CardBody, Input, Slider, SliderFilledTrack, SliderThumb, SliderTrack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function Home() {
    const generateImageApi = api.gen.genImage.useMutation();
    const [imagefile, setImagefile] = useState<File>();
    const [scale, setScale] = useState(0.8);
    const [rotate, setRotate] = useState(0);
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 } as { width: number, height: number })
    const onGenerate = () => {
        // console.log(imagefile);
        // file to base64
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
            });

        }
    }

    const getImageSize = (base64: string) => {
        const img = new Image();
        img.src = base64;
        return {
            width: img.width,
            height: img.height
        }
    }

    useEffect(() => {
        if (generateImageApi.data) {
            setImageSize(getImageSize(generateImageApi.data))
        }
    }, [generateImageApi.data]);

    return (
        <div className="max-w-2xl mx-auto p-5">
            <Card>
                <CardBody>
                    <div className="flex flex-col gap-3">
                        {generateImageApi.data && <div className="flex flex-col">
                            <div className="border">
                                <img className="" src={generateImageApi.data} alt="" />
                            </div>
                            {/* <div>{imageSize.width}x{imageSize.height}</div> */}
                        </div>}

                        <Input onChange={(e) => {
                            if (e.target.files) {
                                setImagefile(e.target.files[0])
                            }
                        }} type="file" />
                        <div className="flex gap-5 items-center">
                            <div className="w-fit">{scale}</div>
                            <Slider defaultValue={0.8} value={scale} min={0.5} max={2} step={0.1} onChange={(v) => setScale(v)}>
                                <SliderTrack bg='gray.100'>
                                    <SliderFilledTrack bg='blue' />
                                </SliderTrack>
                                <SliderThumb boxSize={6} />
                            </Slider>
                        </div>
                        <div className="flex gap-5 items-center">
                            <div className="w-10">{rotate} </div>
                            <Slider defaultValue={0} value={rotate} min={-360} max={360} step={90} onChange={(v) => setRotate(v)}>
                                <SliderTrack bg='gray.100'>
                                    <SliderFilledTrack bg='blue' />
                                </SliderTrack>
                                <SliderThumb boxSize={6} />
                            </Slider>
                        </div>
                        <Button isLoading={generateImageApi.isPending} onClick={onGenerate} colorScheme='blue'>สร้าง</Button>
                    </div>
                </CardBody>
            </Card>

        </div>
    );
}
