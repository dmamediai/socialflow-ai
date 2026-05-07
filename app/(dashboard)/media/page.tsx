"use client";

import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Upload, Trash2, Image as ImageIcon, Video, Loader2,
  X, Download, Search, Grid3X3, List
} from "lucide-react";
import type { MediaLibraryItem } from "@/types";
import { formatFileSize, formatRelativeTime } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export default function MediaPage() {
  const [items, setItems] = useState<MediaLibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    async function init() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        loadMedia(user.id);
      }
    }
    init();
  }, []);

  async function loadMedia(uid: string) {
    const supabase = createClient();
    const { data } = await supabase
      .from("media_library")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });
    setItems((data ?? []) as MediaLibraryItem[]);
    setLoading(false);
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!userId) return;
    setUploading(true);

    const supabase = createClient();

    for (const file of acceptedFiles) {
      const ext = file.name.split(".").pop();
      const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(path, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        toast.error(`Failed to upload ${file.name}: ${uploadError.message}`);
        continue;
      }

      const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);

      await supabase.from("media_library").insert({
        user_id: userId,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        storage_path: path,
        public_url: urlData.publicUrl,
      });

      toast.success(`${file.name} uploaded`);
    }

    loadMedia(userId);
    setUploading(false);
  }, [userId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"],
      "video/*": [".mp4", ".mov", ".avi", ".webm"],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  async function deleteMedia(item: MediaLibraryItem) {
    setDeletingId(item.id);
    const supabase = createClient();

    await Promise.all([
      supabase.storage.from("media").remove([item.storage_path]),
      supabase.from("media_library").delete().eq("id", item.id),
    ]);

    toast.success("File deleted");
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    setDeletingId(null);
  }

  const filteredItems = items.filter((item) =>
    item.file_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold">Media Library</h2>
        <p className="text-muted-foreground text-sm mt-0.5">
          Upload and manage your images and videos
        </p>
      </div>

      {/* Upload zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/30"
        }`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Uploading files...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 rounded-xl bg-muted">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-sm">
                {isDragActive ? "Drop files here" : "Drag & drop files here"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                or click to browse — Images & videos up to 50MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-8 text-sm"
          />
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <Button
            variant={view === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setView("grid")}
          >
            <Grid3X3 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant={view === "list" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setView("list")}
          >
            <List className="h-3.5 w-3.5" />
          </Button>
        </div>
        <Badge variant="secondary" className="text-xs">
          {filteredItems.length} {filteredItems.length === 1 ? "file" : "files"}
        </Badge>
      </div>

      {/* Media grid/list */}
      {loading ? (
        <div className={view === "grid" ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3" : "space-y-2"}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`${view === "grid" ? "aspect-square" : "h-16"} rounded-xl bg-muted animate-pulse`} />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="font-semibold">No media yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Upload images and videos to use in your posts
            </p>
          </CardContent>
        </Card>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filteredItems.map((item) => (
            <div key={item.id} className="group relative aspect-square rounded-xl overflow-hidden bg-muted border">
              {item.file_type.startsWith("image/") ? (
                <img
                  src={item.public_url}
                  alt={item.file_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Video className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <a href={item.public_url} target="_blank" rel="noopener noreferrer" download>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-white/20">
                    <Download className="h-4 w-4" />
                  </Button>
                </a>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={() => deleteMedia(item)}
                  disabled={deletingId === item.id}
                >
                  {deletingId === item.id
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : <Trash2 className="h-4 w-4" />
                  }
                </Button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs truncate">{item.file_name}</p>
                <p className="text-white/70 text-xs">{formatFileSize(item.file_size)}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredItems.map((item) => (
            <Card key={item.id} className="card-hover">
              <CardContent className="p-3 flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted shrink-0 flex items-center justify-center">
                  {item.file_type.startsWith("image/") ? (
                    <img src={item.public_url} alt={item.file_name} className="w-full h-full object-cover" />
                  ) : (
                    <Video className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.file_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(item.file_size)} · {formatRelativeTime(item.created_at)}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs shrink-0">
                  {item.file_type.split("/")[0]}
                </Badge>
                <div className="flex items-center gap-1">
                  <a href={item.public_url} target="_blank" rel="noopener noreferrer" download>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </a>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => deleteMedia(item)}
                    disabled={deletingId === item.id}
                  >
                    {deletingId === item.id
                      ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      : <Trash2 className="h-3.5 w-3.5" />
                    }
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
