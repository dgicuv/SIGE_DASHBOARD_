import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type Props = React.ComponentProps<"form"> & {
  error?: string;
};

export function LoginForm({ className, error, ...props }: Props) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold font-heading">SIGE Gerencial</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Ingresa tus credenciales para continuar
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="username">Usuario</FieldLabel>
          <Input id="username" name="username" type="text" placeholder="usuario" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Contraseña</FieldLabel>
          <Input id="password" name="password" type="password" required />
        </Field>
        {error && (
          <FieldDescription className="text-destructive text-center">
            {error}
          </FieldDescription>
        )}
        <Field>
          <Button type="submit" className="w-full">Iniciar sesión</Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
