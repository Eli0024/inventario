import { Component, OnInit,AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CalendarOptions } from '@fullcalendar/core';
import { EventoService } from '../services/evento.service';
import { Evento } from '../models/evento';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import esLocale from '@fullcalendar/core/locales/es';
import { RouterLink,RouterModule } from '@angular/router';
import { FlatpickrModule } from 'angularx-flatpickr';
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import flatpickr from 'flatpickr';




@Component({
  selector: 'app-calendar-mant',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, FormsModule,RouterModule,FlatpickrModule],
  templateUrl: './calendar-mant.component.html',
  styleUrls: ['./calendar-mant.component.css']
})
export class CalendarMantComponent implements OnInit {

  eventos: Evento[] = [];
  
  
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
    initialView: 'dayGridMonth',
    events: [],
    locale: esLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    buttonText: {
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      day: 'Día'
    },
    dayHeaderFormat: { weekday: 'long' },
    firstDay: 1,
    allDayText: 'Todo el día',
    moreLinkText: 'más',
    noEventsText: 'No hay eventos para mostrar',
    height: 'auto',
    contentHeight: 'auto',
    aspectRatio:1.5
  };

  modalAbierto = false;
  modoEdicion = false;
  eventoActual: Partial<Evento> = {};
  horasDisponibles:string[]=[];

  constructor(
    private eventoService: EventoService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadEventos();
    this.iniciarVerificacionNotificaciones();
    this.generarHorasDisponibles();
  }

  loadEventos() {
    this.eventoService.getAll().subscribe({
      next: (data) => {
        this.eventos = data;
        this.actualizarOpcionesCalendario();
      },
      error: (err) => console.error(err)
    });
  }

  generarHorasDisponibles() {
  const horas: string[] = [];
  const formato = (hora: number, minuto: number) => {
    const h = hora % 12 === 0 ? 12 : hora % 12;
    const ampm = hora < 12 ? 'AM' : 'PM';
    const m = minuto.toString().padStart(2, '0');
    return `${h}:${m} ${ampm}`;
  };

  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      horas.push(formato(h, m));
    }
  }
  this.horasDisponibles = horas;
}

  actualizarOpcionesCalendario() {
    this.calendarOptions = {
      ...this.calendarOptions,
      events: this.eventos.map(e => ({
        id: e.id.toString(),
        title: e.titulo,
        start: e.fecha_inicio,
        end: e.fecha_fin ?? undefined,
        color: e.color ?? '#4f46e5',
      })),
      dateClick: this.onDateClick.bind(this),
      eventClick: this.onEventClick.bind(this),
      eventDidMount: this.eventoMontado.bind(this)
    };
  }

  eventoMontado(info: any) {
    if (info.event.extendedProps.descripcion) {
      info.el.setAttribute('title', info.event.extendedProps.descripcion);
    }
    
    // Añadir tooltip personalizado
    const eventEl = info.el;
    eventEl.classList.add('group', 'relative');
    
    if (info.event.extendedProps.descripcion) {
      const tooltip = document.createElement('div');
      tooltip.className = 'absolute invisible group-hover:visible z-50 bg-gray-900 text-white text-xs rounded py-1 px-2 bottom-full mb-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap';
      tooltip.textContent = info.event.extendedProps.descripcion;
      eventEl.appendChild(tooltip);
    }
  }

  onDateClick(arg: any) {
    this.modoEdicion = false;
    this.eventoActual = {
      titulo: '',
      fecha_inicio: arg.dateStr + 'T09:00',
      fecha_fin: arg.dateStr + 'T10:00',
      color: '#4f46e5'
    };
    this.modalAbierto = true;
  }

  onEventClick(info: any) {
    const evento = this.eventos.find(e => e.id === +info.event.id);
    if (evento) {
      this.modoEdicion = true;
      this.eventoActual = { ...evento };

      this.eventoActual.fecha_inicio = evento.fecha_inicio?.slice(0, 16); 
    this.eventoActual.fecha_fin = evento.fecha_fin?.slice(0, 16);
      this.modalAbierto = true;
    }
  }

  guardarEvento() {

    this.eventoActual.fecha_inicio = this.combinarFechaHora(
      this.eventoActual.fecha_inicio!,
      this.eventoActual.hora_inicio!
    );

    if (this.eventoActual.fecha_fin && this.eventoActual.hora_fin) {
      this.eventoActual.fecha_fin = this.combinarFechaHora(
        this.eventoActual.fecha_fin!,
        this.eventoActual.hora_fin!
      );
    }


    const payload: any = { ...this.eventoActual };

    if (payload.fecha_fin === undefined) {
      payload.fecha_fin = null;
    }

    if (payload.color === undefined) {
      payload.color = null;
    }

    delete payload.empresa;

    console.log('Payload que se envia al backend:', payload);
    
    if (this.modoEdicion && this.eventoActual.id) {
      this.eventoService.update(this.eventoActual.id, this.eventoActual).subscribe({
        next: () => {
          this.toastr.success('Evento actualizado correctamente');
          this.cerrarModal();
          this.loadEventos();
        },
        error: () => this.toastr.error('Error al actualizar el evento')
      });
    } else {
      this.eventoService.create(this.eventoActual as Omit<Evento, 'id'>).subscribe({
        next: () => {
          this.toastr.success('Evento creado correctamente');
          this.cerrarModal();
          this.loadEventos();
        },
        error: () => this.toastr.error('Error al crear el evento')
      });
    }
  }

  eliminarEvento() {
    if (this.eventoActual.id) {
      if (confirm('¿Estás seguro de que deseas eliminar este evento?')) {
        this.eventoService.delete(this.eventoActual.id).subscribe({
          next: () => {
            this.toastr.success('Evento eliminado correctamente');
            this.cerrarModal();
            this.loadEventos();
          },
          error: () => this.toastr.error('Error al eliminar el evento')
        });
      }
    }
  }
  
  private combinarFechaHora(fecha: string, hora: string): string {
    const [time, ampm] = hora.split(' ');
    let [h, m] = time.split(':').map(Number);

    if (ampm === 'PM' && h < 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;

    const hh = h.toString().padStart(2, '0');
    const mm = m.toString().padStart(2, '0');

    return `${fecha}T${hh}:${mm}`;
  }
  

  cerrarModal() {
    this.modalAbierto = false;
    this.eventoActual = {};
  }

  iniciarVerificacionNotificaciones() {
    setInterval(() => {
      const ahora = new Date();
      this.eventos.forEach(evento => {
        if (evento.fecha_fin) {
          const fechaFin = new Date(evento.fecha_fin);
          const diffHoras = (fechaFin.getTime() - ahora.getTime()) / (1000 * 60 * 60);

          if (diffHoras > 0 && diffHoras <= 3) {
            this.toastr.warning(
              `El evento "${evento.titulo}" finaliza en ${Math.ceil(diffHoras)} horas`,
              'Recordatorio'
            );
          }
        }
      });
    }, 60000);
  }
}