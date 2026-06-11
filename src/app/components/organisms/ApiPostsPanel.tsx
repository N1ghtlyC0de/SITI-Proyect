import { FormEvent, useEffect, useMemo, useState } from "react";
import { AlertBanner } from "../molecules/AlertBanner";
import { FormField, TextareaField } from "../molecules/FormField";
import { LoadingSpinner } from "../atoms/LoadingSpinner";
import { createPost, deletePost, getPosts, testBackendConnection } from "../../services/postsService";
import { getBackendConfig } from "../../services/apiClient";
import type { ApiPost } from "../../types/api";

interface ApiPostsPanelProps {
  className?: string;
}

interface FormState {
  title: string;
  body: string;
}

const INITIAL_FORM: FormState = {
  title: "",
  body: "",
};

export function ApiPostsPanel({ className = "" }: ApiPostsPanelProps) {
  const backend = getBackendConfig();
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [checkingConnection, setCheckingConnection] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [lastCreatedId, setLastCreatedId] = useState<number | null>(null);

  const titleError = useMemo(() => {
    if (!form.title.trim()) return "El titulo es obligatorio.";
    if (form.title.trim().length < 4) return "Usa al menos 4 caracteres.";
    return "";
  }, [form.title]);

  const bodyError = useMemo(() => {
    if (!form.body.trim()) return "La descripcion es obligatoria.";
    if (form.body.trim().length < 10) return "Usa al menos 10 caracteres.";
    return "";
  }, [form.body]);

  const canSubmit = !titleError && !bodyError && !submitting;

  async function checkConnection() {
    setCheckingConnection(true);
    try {
      const connected = await testBackendConnection();
      setIsConnected(connected);
    } finally {
      setCheckingConnection(false);
    }
  }

  async function loadPosts() {
    setLoading(true);
    setLoadingError(null);
    try {
      const data = await getPosts(6);
      setPosts(data);
    } catch (error) {
      setLoadingError("No fue posible cargar las publicaciones. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadPosts();
    void checkConnection();
  }, []);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSubmitError(null);
    setSubmitMessage(null);
  }

  async function submitCurrentPost() {
    if (!canSubmit) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const created = await createPost({
        title: form.title.trim(),
        body: form.body.trim(),
        userId: 1,
      });

      setPosts((prev) => [created, ...prev]);
      setLastCreatedId(created.id);
      setSubmitMessage("Publicacion creada correctamente. Puedes deshacer esta accion.");
      setForm(INITIAL_FORM);
    } catch (error) {
      setSubmitError("No se pudo guardar la publicacion. Verifica tu conexion e intenta otra vez.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    await submitCurrentPost();
  }

  async function handleUndo() {
    if (!lastCreatedId) return;

    try {
      setDeletingId(lastCreatedId);
      const deleted = await deletePost(lastCreatedId);

      if (deleted) {
        setPosts((prev) => prev.filter((post) => post.id !== lastCreatedId));
        setSubmitMessage("Se deshizo la ultima publicacion.");
      } else {
        setSubmitError("No fue posible deshacer porque la publicacion ya no existe.");
      }
      setLastCreatedId(null);
    } catch {
      setSubmitError("No se pudo deshacer la publicacion. Intenta nuevamente.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleDeletePost(postId: number) {
    try {
      setDeletingId(postId);
      const deleted = await deletePost(postId);
      if (deleted) {
        setPosts((prev) => prev.filter((post) => post.id !== postId));
        setSubmitMessage("Publicacion eliminada correctamente.");
      } else {
        setSubmitError("La publicacion no existe o ya fue eliminada.");
      }
    } catch {
      setSubmitError("No se pudo eliminar la publicacion.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section
      className={`rounded-card border border-border bg-card p-4 shadow-sm md:p-6 ${className}`}
      aria-labelledby="api-posts-title"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="api-posts-title" className="text-xl font-bold text-foreground">
            Integracion API (GET + POST)
          </h2>
          <p className="text-sm text-muted-foreground">
            Conexion en modo {backend.mode.toUpperCase()} con validacion y feedback de estado.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {backend.mode === "graphql" ? backend.graphqlEndpoint : backend.restBaseUrl}
          </p>
          <p className="mt-1 text-xs" aria-live="polite">
            Estado de conexion: {checkingConnection ? "verificando..." : isConnected === null ? "pendiente" : isConnected ? "conectado" : "sin conexion"}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void checkConnection()}
            className="btn-secondary"
            aria-label="Verificar conexion con el backend"
            disabled={checkingConnection}
          >
            {checkingConnection ? "Verificando..." : "Verificar"}
          </button>
          <button
            type="button"
            onClick={() => void loadPosts()}
            className="btn-secondary"
            aria-label="Actualizar publicaciones desde la API"
            disabled={loading}
          >
            {loading ? "Cargando..." : "Actualizar"}
          </button>
        </div>
      </div>

      <div aria-live="polite" aria-atomic="true" className="mb-3 min-h-8">
        {submitMessage && (
          <AlertBanner
            type="success"
            message={submitMessage}
            actions={
              lastCreatedId ? (
                <button type="button" className="btn-secondary" onClick={handleUndo}>
                  {deletingId === lastCreatedId ? "Deshaciendo..." : "Deshacer"}
                </button>
              ) : null
            }
            onClose={() => setSubmitMessage(null)}
          />
        )}
        {submitError && <AlertBanner type="error" message={submitError} onClose={() => setSubmitError(null)} />}
        {loadingError && <AlertBanner type="error" message={loadingError} onClose={() => setLoadingError(null)} />}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={handleSubmit} noValidate aria-label="Formulario de publicacion">
          <fieldset disabled={submitting} className="space-y-4">
            <legend className="mb-1 text-sm font-semibold text-foreground">Crear nueva publicacion</legend>
            <FormField
              fieldId="post-title"
              label="Titulo"
              required
              placeholder="Ej: Venta de la manana"
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              errorMessage={form.title ? titleError : ""}
              aria-describedby="post-shortcut-help"
            />
            <TextareaField
              fieldId="post-body"
              label="Descripcion"
              required
              placeholder="Describe el resultado del turno o una novedad"
              value={form.body}
              onChange={(event) => updateField("body", event.target.value)}
              errorMessage={form.body ? bodyError : ""}
              rows={4}
              onKeyDown={async (event) => {
                if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
                  event.preventDefault();
                  await submitCurrentPost();
                }
              }}
            />
            <p id="post-shortcut-help" className="text-xs text-muted-foreground">
              Atajo: Ctrl+Enter para publicar.
            </p>
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={!canSubmit}
              aria-label={submitting ? "Publicando" : "Publicar en la API"}
            >
              {submitting ? "Publicando..." : "Publicar"}
            </button>
          </fieldset>
        </form>

        <div aria-label="Listado de publicaciones">
          <h3 className="mb-3 text-base font-semibold text-foreground">Ultimas publicaciones</h3>
          {loading ? (
            <div className="flex min-h-40 items-center justify-center" aria-live="polite">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <ul className="space-y-3">
              {posts.map((post) => (
                <li key={post.id}>
                  <article className="rounded-xl border border-border bg-background p-3">
                    <div className="mb-1 flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold text-foreground">{post.title}</h4>
                      <button
                        type="button"
                        className="text-xs font-semibold text-destructive"
                        onClick={() => void handleDeletePost(post.id)}
                        disabled={deletingId === post.id}
                        aria-label={`Eliminar publicacion ${post.id}`}
                      >
                        {deletingId === post.id ? "Eliminando..." : "Eliminar"}
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground">{post.body}</p>
                    <p className="mt-2 text-xs text-muted-foreground">ID: {post.id}</p>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
