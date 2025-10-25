import { useMutation } from "@tanstack/react-query";
import { pipelineService } from "@/apis/pipeline";

const CONVERT_TO_ONNX_KEY = ["pipeline", "convert-to-onnx"];

export const useConvertToOnnx = () => {
  return useMutation({
    mutationKey: CONVERT_TO_ONNX_KEY,
    mutationFn: async (modelPath: string) => {
      const blob = await pipelineService.convertToOnnx(modelPath);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Extract model name from path for filename
      const modelName = modelPath.split("/").pop() || "model";
      link.download = `${modelName}_onnx.zip`;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return blob;
    },
  });
};
