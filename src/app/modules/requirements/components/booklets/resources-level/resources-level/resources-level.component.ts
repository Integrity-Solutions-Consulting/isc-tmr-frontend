import { Component } from '@angular/core';

@Component({
  selector: 'app-resources-level',
  standalone: true,
  imports: [],
  templateUrl: './resources-level.component.html',
  styleUrl: './resources-level.component.scss'
})
export class ResourcesLevelComponent {
  // Variables para almacenar la cantidad de cada recurso
  junior: number = 0;
  semisenior: number = 0;
  senior: number = 0;
  especialista: number = 0;

  // Propiedad calculada para el total (se actualiza sola)
  get total(): number {
    return this.junior + this.semisenior + this.senior + this.especialista;
  }

  // Método para aumentar
  aumentar(tipo: 'jun' | 'semi' | 'sen' | 'esp') {
    if (tipo === 'jun') this.junior++;
    if (tipo === 'semi') this.semisenior++;
    if (tipo === 'sen') this.senior++;
    if (tipo === 'esp') this.especialista++;
  }

  // Método para disminuir (evita números negativos)
  disminuir(tipo: 'jun' | 'semi' | 'sen' | 'esp') {
    if (tipo === 'jun' && this.junior > 0) this.junior--;
    if (tipo === 'semi' && this.semisenior > 0) this.semisenior--;
    if (tipo === 'sen' && this.senior > 0) this.senior--;
    if (tipo === 'esp' && this.especialista > 0) this.especialista--;
  }
}
