import { Input } from "components/ui/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";
import { CameraIcon } from "lucide-react";
import { type ChangeEvent, type FC, useRef, useState } from "react";

type AvatarFieldProps = {
  onImageChange: (image: string) => void;
  initialImage?: string;
};

export const AvatarField: FC<AvatarFieldProps> = ({ initialImage, onImageChange }) => {
  const [imageSrc, setImageSrc] = useState<string | undefined>(() => initialImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const stringImage = reader.result as string;
        setImageSrc(stringImage);
        onImageChange(stringImage);
        onImageChange(stringImage);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = () => {
    setImageSrc(undefined);
    onImageChange("");
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <Input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
      />
      <div className="relative w-32 h-32 mx-auto">
        {imageSrc ? (
          <FontAwesomeIcon
            icon="trash"
            className="absolute cursor-pointer bottom-0 right-0 hover:text-destructive"
            onClick={handleClearImage}
          />
        ) : null}
        <Avatar className="w-32 h-32 mx-auto cursor-pointer" onClick={triggerFileUpload}>
          <AvatarImage className="object-cover" src={imageSrc} alt="User Avatar" />
          <AvatarFallback delayMs={600}>
            {imageSrc ? null : <CameraIcon width={24} height={24} />}{" "}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};
