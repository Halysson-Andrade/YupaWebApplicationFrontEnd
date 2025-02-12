import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { MatDialog } from '@angular/material/dialog';
import { LegendModalComponent } from '../../shared/components/legend-modal/legend-modal.component';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { DateFilterComponent } from '../../shared/components/date-filter/date-filter.component';
import { SharedModule } from 'src/app/shared/shared.module';

interface Technician {
  name: string;
  details: {
    nome: string;
    centro_custo: string;
    filial: string;
  }[];
}

interface ApiResponse {
  data: {
    techniciansData: Technician[];
    EChartsOption: {
      pie?: EChartsOption;
      bar?: EChartsOption;
    };
  };
}

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [CommonModule, NgxEchartsDirective, DateFilterComponent, SharedModule],
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
  providers: [provideEcharts(), AuthService],
})
export class ChartsComponent implements OnInit {
  environment = environment;
  techniciansData: Technician[] = [];
  chartPie: EChartsOption = {}; // Inicialmente vazio
  chartBar: EChartsOption = {}; // Inicialmente vazio
  isChartInit = false;
  isLoading = false;

  startDate: Date | null = null;
  endDate: Date | null = null;

  constructor(private dialog: MatDialog, private http: HttpClient, private authService: AuthService) { }

  ngOnInit(): void {
    // Verifique se startDate e endDate são válidos e carregue os gráficos se necessário
    console.log('Start Date on Init:', this.startDate);
    console.log('End Date on Init:', this.endDate);
    if (this.startDate && this.endDate) {
      this.loadCharts();
    }
  }

  loadCharts(): void {
    // Define isLoading como true para mostrar o loader
    this.isLoading = true;

    // Limpa os dados dos gráficos
    this.chartPie = {};
    this.chartBar = {};

    const token = sessionStorage.getItem('auth_token');
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        UserId: '1',
      });

      const params = {
        startDate: this.startDate ? this.startDate.toISOString() : '',
        endDate: this.endDate ? this.endDate.toISOString() : '',
      };
      console.log('Start Date on Init:', params.startDate);
      console.log('Start Date on Init:', params.endDate);

      this.http
        .get<ApiResponse>(`${this.environment.apiURL}/charts`, { headers, params })
        .subscribe(
          (response: ApiResponse) => {
            this.techniciansData = response.data.techniciansData;
            this.chartPie = response.data.EChartsOption.pie || {};
            this.chartBar = response.data.EChartsOption.bar || {};
          },
          (error) => {
            console.error('Erro ao buscar dados:', error);
          },
          () => {
            // Define isLoading como false quando o carregamento estiver concluído
            this.isLoading = false;
          }
        );
    } else {
      console.error('Token de autenticação não encontrado.');
      this.isLoading = false; // Garante que o loader seja ocultado mesmo se o token não for encontrado
    }
  }

  onChartInit(ec: any): void {
    if (!this.isChartInit) {
      this.isChartInit = true;
      ec.on('click', (params: { name: string }) => {
        const technicianInfo = this.techniciansData.find((item) => item.name === params.name);
        if (technicianInfo) {
          this.openModal(technicianInfo);
        }
      });
    }
  }

  openModal(data: any): void {
    const openDialogs = this.dialog.openDialogs;
    if (openDialogs.length === 0) {
      const dialogConfig = {
        width: '80%',
        maxWidth: '1200px',
        height: '80%',
        data: data,
      };
      this.dialog.open(LegendModalComponent, dialogConfig);
    }
  }

  onFilterApplied(filters: { startDate: Date | null; endDate: Date | null }): void {
    this.startDate = filters.startDate;
    this.endDate = filters.endDate;
    this.loadCharts();
  }
}