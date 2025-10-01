"use client";

import { TrainerDetailView } from "@/components/Train";
import { TrainerParams } from "@/constants/routes";
import { useParams } from "next/navigation";



export default function TrainerPage() {
    const { trainerId } = useParams<TrainerParams>();
    return (
        <TrainerDetailView trainerId={trainerId} />
    )
}