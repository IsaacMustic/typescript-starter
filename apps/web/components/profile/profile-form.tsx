"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  image: z.string().url("Invalid URL").optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const { data: user, isLoading } = trpc.user.getProfile.useQuery();
  const [error, setError] = useState<string | null>(null);
  const utils = trpc.useUtils();
  const { mutate: updateProfile, isPending } = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      utils.user.getProfile.invalidate();
      setError(null);
    },
    onError: (err: { message: string }) => {
      setError(err.message);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      image: user?.image ?? "",
    },
  });

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  const onSubmit = (data: ProfileFormData) => {
    setError(null);
    updateProfile(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6 border rounded-lg max-w-2xl">
      {error && (
        <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          {...register("name")}
          className="w-full px-3 py-2 border rounded-md"
          disabled={isPending}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="image" className="text-sm font-medium">
          Image URL
        </label>
        <input
          id="image"
          type="url"
          {...register("image")}
          className="w-full px-3 py-2 border rounded-md"
          disabled={isPending}
        />
        {errors.image && (
          <p className="text-sm text-destructive">{errors.image.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium disabled:opacity-50"
        disabled={isPending}
      >
        {isPending ? "Updating..." : "Update Profile"}
      </button>
    </form>
  );
}

