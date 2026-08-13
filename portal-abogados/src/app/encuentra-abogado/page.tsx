import Link from "next/link";
import { ArrowRight, LockKeyhole, Scale } from "lucide-react";

export default function EncuentraAbogadoPage() {
  return <main className="wizard-page"><Link className="auth-brand" href="/"><span><Scale size={20} /></span>JurisConecta</Link><section className="success-state account-gate"><span className="empty-mark"><LockKeyhole size={25} /></span><p className="eyebrow">Tu espacio personal</p><h1>Primero crea o abre tu cuenta.</h1><p>Así podrás publicar tu caso, guardar sus antecedentes y seguir las respuestas desde un panel privado.</p><div><Link className="primary-button" href="/registro">Crear cuenta <ArrowRight size={18} /></Link><Link className="secondary-button" href="/ingresar">Ingresar</Link></div></section></main>;
}
