import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useForm, type FieldErrors } from "react-hook-form"
import { toast } from "sonner"
import imagen from '../assets/imagen.svg'
import { Badge } from "@/components/ui/badge"
import { CircleDot } from "lucide-react"

const ENV_BADGE: Record<string, string> = {
  development: "Development",
  training:    "Training",
}


type LoginFormData = {
  username: string
  password: string
}

type LoginFormProps = Omit<React.ComponentProps<"div">, "onSubmit"> & {
  onSubmit: (data: LoginFormData) => Promise<void>
}

export function LoginForm({
  className,
  onSubmit,
  ...props
}: LoginFormProps) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<LoginFormData>()

  function handleInvalid(errors: FieldErrors<LoginFormData>) {
    const first = Object.values(errors)[0]?.message
    if (first) toast.error(first)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 shadow-lg">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit, handleInvalid)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">SIGE <small className="font-normal">Gerencial</small></h1>
                <p className="text-balance text-xs">Sistema Institucional de Gestión Estratégica</p>
                {ENV_BADGE[import.meta.env.MODE] && (
                  <Badge className="bg-red-600 text-white border-transparent">
                    <CircleDot data-icon="inline-start" />
                    Ambiente de {ENV_BADGE[import.meta.env.MODE]}
                  </Badge>
                )}
                <p className="text-balance text-muted-foreground mt-4">
                  Inicio de Sesión
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="username">Usuario</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  {...register("username", { required: "El usuario es requerido" })}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  {...register("password", { required: "La contraseña es requerida" })}
                />
              </Field>
              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            


          <img
              src={imagen}
              alt="SIGE"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Universidad Veracruzana. Al acceder a este sitio aceptas nuestra{" "}
        <a href="#">Política de Privacidad</a>.
      </FieldDescription>
    </div>
  )
}
