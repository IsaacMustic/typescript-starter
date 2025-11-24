"use client";

import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AvatarUploadProps {
  currentImageUrl?: string | null;
  onImageChange?: (url: string) => void;
}

export function AvatarUpload({ currentImageUrl, onImageChange }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImageUrl ?? null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      // Convert to base64 for now (in production, upload to S3)
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        if (onImageChange) {
          onImageChange(base64String);
        }
        setIsUploading(false);
        toast.success("Image selected successfully");
      };
      reader.onerror = () => {
        toast.error("Failed to read image");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (_error) {
      toast.error("Failed to process image");
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onImageChange) {
      onImageChange("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {preview ? (
          <div className="relative">
            {/* biome-ignore lint/performance/noImgElement: Data URL preview requires img element */}
            <img
              src={preview}
              alt="Avatar preview"
              className="h-24 w-24 rounded-full object-cover border-2 border-border"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={handleRemove}
              aria-label="Remove avatar"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-border">
            <Upload className="h-8 w-8 text-muted-foreground" />
          </div>
        )}

        <div className="flex-1 space-y-2">
          <Label htmlFor="avatar-upload" className="cursor-pointer">
            <Button
              type="button"
              variant="outline"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? "Uploading..." : "Upload Avatar"}
            </Button>
          </Label>
          <Input
            id="avatar-upload"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
          <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max size 5MB.</p>
        </div>
      </div>
    </div>
  );
}
