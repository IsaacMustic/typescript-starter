"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import { AvatarUpload } from "./avatar-upload";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  image: z.string().url("Invalid URL").optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const { data: user, isLoading } = trpc.user.getProfile.useQuery();
  const utils = trpc.useUtils();
  const { mutate: updateProfile, isPending } = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      utils.user.getProfile.invalidate();
      toast.success("Profile updated successfully");
    },
    onError: (err: { message: string }) => {
      toast.error(err.message || "Failed to update profile");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      image: user?.image ?? "",
    },
    values: {
      name: user?.name ?? "",
      image: user?.image ?? "",
    },
  });

  if (isLoading) {
    return (
      <Card className="p-6 max-w-2xl">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-32" />
        </div>
      </Card>
    );
  }

  const onSubmit = (data: ProfileFormData) => {
    updateProfile(data);
  };

  const imageUrl = watch("image") || user?.image;

  return (
    <Card className="p-6 max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label>Avatar</Label>
            <AvatarUpload
              currentImageUrl={imageUrl}
              onImageChange={(url) => {
                // Update form value when avatar changes
                const form = document.querySelector("form");
                if (form) {
                  const imageInput = form.querySelector('input[name="image"]') as HTMLInputElement;
                  if (imageInput) {
                    imageInput.value = url;
                  }
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register("name")}
              disabled={isPending}
              aria-invalid={errors.name ? "true" : "false"}
            />
            {errors.name && (
              <p className="text-sm text-destructive" role="alert">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              type="url"
              {...register("image")}
              disabled={isPending}
              aria-invalid={errors.image ? "true" : "false"}
            />
            {errors.image && (
              <p className="text-sm text-destructive" role="alert">
                {errors.image.message}
              </p>
            )}
          </div>
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Updating..." : "Update Profile"}
        </Button>
      </form>
    </Card>
  );
}
