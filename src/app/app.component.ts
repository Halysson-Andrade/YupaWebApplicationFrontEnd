import { Component } from '@angular/core';
import { ThemeService } from './core/services/theme/theme.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    const themeColor = `${environment.themeColors}`;
    this.themeService.loadColors(themeColor).subscribe((colors) => {
      this.themeService.applyColors(colors);
    });
  }
}
