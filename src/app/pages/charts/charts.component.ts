import { CommonModule } from '@angular/common';
import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { MatDialog } from '@angular/material/dialog';
import { LegendModalComponent } from '../../shared/components/legend-modal/legend-modal.component';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

interface Technician {
  name: string;
  details: {
  }[];
}
interface KanbanStatus {
  id: string;
  nome: string;
  emoji: string;
  quantidade: number;
}

interface CentroCusto {
  flt_id: number;
  flt_name: string;
}

interface CentroCustoResponse {
  data: CentroCusto[];
}

interface ApiResponse {
  data: {
    EChartsData: {
      techniciansData: Technician[];
    },
    EChartsOption: {
      pie?: EChartsOption;
      bar?: EChartsOption;
      pieDays?: EChartsOption;
      chartBarBoss?: EChartsOption;
      chartPiePetrol?: EChartsOption;
      chartBossPetrol?:EChartsOption;
      chartLineTsk?: EChartsOption;
      chartTimeLine?: EChartsOption;
      chartLineProt?: EChartsOption;      
    };
  };
}

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [
    CommonModule
    , NgxEchartsDirective
    , SharedModule
    , MatFormFieldModule
    , MatSelectModule
    , MatCheckboxModule
    , FormsModule
  ],
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
  providers: [provideEcharts(), AuthService],
})
export class ChartsComponent implements OnInit {
  @ViewChild(MatSelect) matSelect!: MatSelect; // Acessa o mat-select no template
  environment = environment;
  techniciansData: Technician[] = [];
  technicianIndex: Map<string, Technician> = new Map(); // Novo índice
  chartPieSumary: EChartsOption = {}; // Inicialmente vazio
  chartPiedays: EChartsOption = {}; // Inicialmente vazio
  chartPiePetrol: EChartsOption = {}; // Inicialmente vazio
  chartBossPetrol: EChartsOption = {}; // Inicialmente vazio
  chartPieKm: EChartsOption = {}; // Inicialmente vazio
  chartBarSumary: EChartsOption = {}; // Inicialmente vazio
  chartBarBoss: EChartsOption = {}; // Inicialmente vazio
  chartLineTsk: EChartsOption = {}; // Inicialmente vazio
  chartTimeLine: EChartsOption = {}; // Inicialmente vazio
  chartLineProt: EChartsOption = {}; // Inicialmente vazio
  isChartInit = false;
  isLoading = false;
  errorMessage: string = '';
  originalOverflow: string = '';
  startDateInput: string = '';
  endDateInput: string = '';
  NA: string = '';
  startDate: Date | null = null;
  endDate: Date | null = null;
  userId: any = '';
  items: string[] = [];
  centroCusto: CentroCusto[] = [];
  selectedItems: string[] = [];
  allSelected: boolean = false; // Flag para controlar "Selecionar todos"
  kanbanStatus: KanbanStatus[] = [
    { id: 'processos-dia', nome: 'Processos do Dia', emoji: '📅', quantidade: 45 },
    { id: 'restricao', nome: 'Restrições', emoji: '📌', quantidade: 15 },
    { id: 'debitos', nome: 'Débitos', emoji: '💰', quantidade: 12 },
    { id: 'pendencias', nome: 'Pendências', emoji: '⚠️', quantidade: 7 },
    { id: 'finalizados', nome: 'Finalizados', emoji: '✅', quantidade: 40 }   
  ];

  constructor(
    private dialog: MatDialog,
    private http: HttpClient,
    private toastr: ToastrService,
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void {
    this.isLoading = true; // Exibe o componente de loading
    this.userId = sessionStorage.getItem('usr_id');
    const token = sessionStorage.getItem('auth_token');
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        UserId: this.userId,
      });

      this.http
        .get<CentroCustoResponse>(`${this.environment.apiURL}/filter`, { headers })
        .subscribe(
          (response: CentroCustoResponse) => {
            // Extrair apenas os valores de `cc_system_code` para um novo array
            this.items = response.data.map(filter => filter.flt_name);
            console.log(this.items);  // Exibe o array com os códigos no console
          },
          (err) => {
            this.isLoading = false;
            this.errorMessage = this.extractErrorMessage(err);
            this.toastr.error(this.errorMessage);
          },
          () => {
            this.isLoading = false; // Oculta o componente de loading
          }
        );
    } else {
      console.error('Token de autenticação não encontrado.');
      this.isLoading = false; // Garante que o loader seja ocultado mesmo se o token não for encontrado
    }
  }
  toggleSelectAll() {
    if (this.allSelected) {
      this.selectedItems = []; // Desmarca todos os itens
    } else {
      this.selectedItems = [...this.items]; // Seleciona todos os itens
    }
    this.allSelected = !this.allSelected; // Alterna a flag "Selecionar todos"
  }

  // Atualiza a seleção quando os itens individuais mudam
  onItemSelectionChange() {
    this.allSelected = this.selectedItems.length === this.items.length; // Verifica se todos os itens estão selecionados
  }
  ngAfterViewInit() {
    // Adiciona o ouvinte de evento após o mat-select ser renderizado
    
  }

  onStartDateInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    this.startDateInput = this.formatDateInput(input);
    this.startDate = this.parseDate(this.startDateInput);
  }
  abrirModal(tipo: string) {
    console.log(`Abrindo modal para: ${tipo}`);
    // Aqui você pode chamar um serviço de modal ou definir uma variável de exibição
  }

  onEndDateInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    this.endDateInput = this.formatDateInput(input);
    this.endDate = this.parseDate(this.endDateInput);
  }

  formatDateInput(value: string): string {
    // Remove todos os caracteres não numéricos e limita o comprimento máximo
    value = value.replace(/\D/g, '').slice(0, 8); // Limita a 8 dígitos
    // Adiciona a máscara de data
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    if (value.length > 5) {
      value = value.slice(0, 5) + '/' + value.slice(5);
    }
    return value;
  }

  parseDate(dateStr: string): Date | null {
    if (!dateStr || dateStr.length !== 10) return null;
    const [day, month, year] = dateStr.split('/').map(Number);
    // Verifica a validade da data
    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > 2100) return null;
    return new Date(year, month - 1, day);
  }

  applyFilter(): void {
    if (!this.startDate || !this.endDate) {
      this.toastr.warning('Por favor, selecione ambas as datas.');
      return;
    }
    this.loadCharts(); // Chama a função para carregar os gráficos com as novas datas
  }

  loadCharts(): void {
    this.isLoading = true; // Exibe o componente de loading
    console.log(this.selectedItems)
    this.chartPieSumary = {};
    this.chartBarSumary = {};
    this.chartPiedays = {};
    this.chartBarBoss = {};
    this.chartPiePetrol = {};
    this.chartBossPetrol= {};
    this.chartLineTsk = {};
    this.chartTimeLine = {};
    this.chartLineProt = {};
    this.userId = sessionStorage.getItem('usr_id');
    const token = sessionStorage.getItem('auth_token');
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        UserId: this.userId,
      });

      const params = {
        startDate: this.startDate ? this.startDate.toISOString() : '',
        endDate: this.endDate ? this.endDate.toISOString() : '',
      };
      const body = {
        arrayData: this.selectedItems
      };

      this.http
        .post<ApiResponse>(`${this.environment.apiURL}/charts`, body, { headers, params })
        .subscribe(
          (response: ApiResponse) => {
            this.techniciansData = response.data.EChartsData.techniciansData;
            this.chartPieSumary = response.data.EChartsOption.pie || {};
            this.chartBarSumary = response.data.EChartsOption.bar || {};
            this.chartPiedays = response.data.EChartsOption.pieDays || {};
            this.chartBarBoss = response.data.EChartsOption.chartBarBoss || {};
            this.chartPiePetrol = response.data.EChartsOption.chartPiePetrol || {};
            this.chartBossPetrol = response.data.EChartsOption.chartBossPetrol || {};
            this.chartLineTsk = response.data.EChartsOption.chartLineTsk || {};
            this.chartTimeLine = response.data.EChartsOption.chartTimeLine || {};
            this.chartLineProt = response.data.EChartsOption.chartLineProt || {};
            console.log("Chegou aqui!")
            console.log(response.data.EChartsOption.chartBossPetrol)
            // Cria o índice uma vez após carregar os dados
            this.technicianIndex = new Map(this.techniciansData.map(item => [item.name, item]));
          },
          (err) => {
            this.isLoading = false;
            this.errorMessage = this.extractErrorMessage(err);
            this.toastr.error(this.errorMessage);
          },
          () => {
            this.isLoading = false; // Oculta o componente de loading
          }
        );
    } else {
      console.error('Token de autenticação não encontrado.');
      this.isLoading = false; // Garante que o loader seja ocultado mesmo se o token não for encontrado
    }
  }

  onChartInit(ec: any, chartType: string): void {
    ec.on('click', (params: { name: string, seriesName: string }) => {
      console.log(`${params.name}_${params.seriesName}`)
      console.log(this.technicianIndex)
      let technicianInfo = this.technicianIndex.get(params.name);
      if (!technicianInfo) {
        technicianInfo = this.technicianIndex.get(`${params.name}_${params.seriesName}`);
      }

      if (technicianInfo) {
        this.openModal(technicianInfo);
      } else {
        this.isLoading = false;  // Desativa o carregamento se não encontrar o técnico
        document.body.style.overflow = this.originalOverflow;
      }
    });
  }

  openModal(data: Technician): void {
    if (this.dialog.openDialogs.length > 0) {
      return;
    }
    const dialogConfig = {
      width: '80%',
      maxWidth: '1200px',
      height: '80%',
      autoFocus: false,
      disableClose: true,
      hasBackdrop: true,
      data: data,
      position: {
        top: '100px', // ou '20%',
        left: '100px', // ou 'center', 'right', etc.
      }
    };
    const dialogRef = this.dialog.open(LegendModalComponent, dialogConfig);
  }

  extractErrorMessage(error: any): string {
    if (error.error && error.error.message) {
      return error.error.message;
    } else {
      return 'Erro desconhecido. Por favor, tente novamente mais tarde.';
    }
  }
}

