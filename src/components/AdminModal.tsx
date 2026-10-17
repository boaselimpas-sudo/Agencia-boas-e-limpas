import { X } from 'lucide-react';
export default function AdminModal({onClose}:any){
return(
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
<div className="bg-white rounded-lg p-6 max-w-md w-full">
<div className="flex justify-between"><h2>Painel Admin</h2><button onClick={onClose}><X/></button></div>
<p className="mt-4 text-sm">Painel sem erro!</p>
<button onClick={onClose} className="mt-4 w-full bg-black text-white py-2 rounded">Fechar</button>
</div>
</div>
);
}
