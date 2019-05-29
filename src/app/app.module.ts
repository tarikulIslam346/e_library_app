import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { NgxPaginationModule  } from 'ngx-pagination'; 
import {
  MatFormFieldModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatInputModule,
  MatListModule,
  MatIconModule,
  MatSidenavModule,
  MatToolbarModule,
  MatCheckboxModule,
  MatBadgeModule,
  MatCardModule,
  MatTooltipModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTreeModule,
  MatButtonModule,
  MatAutocompleteModule,
  MatBottomSheetModule,
  MatButtonToggleModule,
  MatChipsModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatMenuModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatTableModule,
  MatTabsModule,
  MatDialogModule,
} from '@angular/material';
import { NavigationComponent } from './navigation/navigation.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddUserComponent } from './add-user/add-user.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { MemberComponent } from './member/member.component';
import { BookIssueComponent } from './book-issue/book-issue.component';
import { AddBookComponent } from './add-book/add-book.component';
import { BookShowComponent, GiveQuery, SeeQuery } from './book-show/book-show.component';
import { AddUserTypeComponent } from './add-user-type/add-user-type.component';
import { AddArchiveComponent } from './add-archive/add-archive.component';
import { ArchiveComponent, ArchiveDialog } from './archive/archive.component';
import { BookCategoryComponent } from './book-category/book-category.component';
import { BookCatComponent } from './book-cat/book-cat.component';
import { BookCatViewComponent } from './book-cat-view/book-cat-view.component';
import { FineComponent } from './fine/fine.component';
import { ShowBookIssueListComponent, ReissueDialog } from './show-book-issue-list/show-book-issue-list.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { ViewUserTypeComponent } from './view-user-type/view-user-type.component';
import { ViewUserTypeMenuPermissionComponent } from './view-user-type-menu-permission/view-user-type-menu-permission.component';
import { BookPdfVieweComponent } from './book-pdf-viewe/book-pdf-viewe.component';
import { ViewIssueDetailsComponent } from './view-issue-details/view-issue-details.component';
import { BookDetailsComponent } from './book-details/book-details.component';
import { VideoDetailsComponent } from './video-details/video-details.component';
import { PptDetailsComponent } from './ppt-details/ppt-details.component';
import { VideoShowComponent } from './video-show/video-show.component';
import { PptShowComponent } from './ppt-show/ppt-show.component';
import { FineDetailsComponent } from './fine-details/fine-details.component';
import { ViewMemberRequestComponent } from './view-member-request/view-member-request.component';
import { IrpShowComponent } from './irp-show/irp-show.component';
import { IrpDetailsComponent } from './irp-details/irp-details.component';
import { JournalShowComponent } from './journal-show/journal-show.component';
import { JournalDetailsComponent } from './journal-details/journal-details.component';
import { SimplePdfViewerModule } from 'simple-pdf-viewer';
import { FineShowComponent } from './fine-show/fine-show.component';
import { UserActivationDialogeComponent } from './user-activation-dialoge/user-activation-dialoge.component';
import { SettingsComponent } from './settings/settings.component';
import { QueryDetailsComponent } from './query-details/query-details.component';
import { AddAuthorComponent } from './add-author/add-author.component';
import { AddPublisherComponent } from './add-publisher/add-publisher.component';
import { ViewAuthorComponent } from './view-author/view-author.component';
import { ViewPublisherComponent } from './view-publisher/view-publisher.component';

const appRoutes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'user', component: ViewUserComponent, canActivate: [AuthGuard] },
  { path: 'add-user', component: AddUserComponent, canActivate: [AuthGuard] },
  { path: 'edit-user/:id', component: AddUserComponent, canActivate: [AuthGuard] },
  { path: 'add-user-type', component: AddUserTypeComponent, canActivate: [AuthGuard] },
  { path: 'edit-user-type/:id/:name', component: AddUserTypeComponent, canActivate: [AuthGuard] },
  { path: 'view-user-type', component: ViewUserTypeComponent, canActivate: [AuthGuard] },

  { path: 'member', component: MemberComponent, canActivate: [AuthGuard] },
  { path: 'view-member-request', component: ViewMemberRequestComponent, canActivate: [AuthGuard] },

  { path: 'book-issue', component: BookIssueComponent, canActivate: [AuthGuard] },
  { path: 'view-book-issue-list', component: ShowBookIssueListComponent, canActivate: [AuthGuard] },

  { path: 'add-book', component: AddBookComponent, canActivate: [AuthGuard] },
  { path: 'edit-book/:id', component: AddBookComponent, canActivate: [AuthGuard] },
  { path: 'add-author', component: AddAuthorComponent,canActivate: [AuthGuard] },
  { path: 'edit-author/:id', component: AddAuthorComponent,canActivate: [AuthGuard] },
  { path: 'view-author', component: ViewAuthorComponent,canActivate: [AuthGuard] },
  { path: 'add-publisher', component: AddPublisherComponent,canActivate: [AuthGuard] },
  { path: 'edit-publisher/:id', component: AddPublisherComponent,canActivate: [AuthGuard] },
  { path: 'view-publisher', component: ViewPublisherComponent,canActivate: [AuthGuard] },
  { path: 'book-category', component: BookCategoryComponent, canActivate: [AuthGuard] },
  { path: 'book-cat', component: BookCatComponent, canActivate: [AuthGuard] },
  { path: 'book-cat-view', component: BookCatViewComponent, canActivate: [AuthGuard] },
  { path: 'edit-cat/:id', component: BookCatComponent, canActivate: [AuthGuard] },
  { path: 'book-show', component: BookShowComponent, canActivate: [AuthGuard] },
  { path: 'video-show', component: VideoShowComponent, canActivate: [AuthGuard] },
  { path: 'ppt-show', component: PptShowComponent, canActivate: [AuthGuard] },
  { path: 'irp-show', component: IrpShowComponent,canActivate: [AuthGuard]},
  { path: 'journal-show', component: JournalShowComponent,canActivate: [AuthGuard]},

  { path: 'archive', component: ArchiveComponent, canActivate: [AuthGuard] },
  { path: 'add-archive', component: AddArchiveComponent, canActivate: [AuthGuard] },
  { path: 'edit-archive/:id', component: AddArchiveComponent, canActivate: [AuthGuard] },


  { path: 'fine-show', component: FineShowComponent, canActivate: [AuthGuard] },
  { path: 'query-show', component: QueryDetailsComponent, canActivate: [AuthGuard]},
  { path: 'change-password', component: SettingsComponent, canActivate: [AuthGuard]},

  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '/login' },
];
@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    DashboardComponent,
    AddUserComponent,
    ViewUserComponent,
    MemberComponent,
    ArchiveComponent,
    BookIssueComponent,
    AddBookComponent,
    BookShowComponent,
    AddUserTypeComponent,
    BookCategoryComponent,
    BookCatComponent,
    BookCatViewComponent,
    AddArchiveComponent,
    BookCategoryComponent,
    FineComponent,
    ShowBookIssueListComponent,
    LoginComponent,
    ViewUserTypeComponent,
    ViewUserTypeMenuPermissionComponent,
    BookPdfVieweComponent,
    ViewIssueDetailsComponent,
    BookDetailsComponent,
    VideoDetailsComponent,
    PptDetailsComponent,
    VideoShowComponent,
    PptShowComponent,
    FineDetailsComponent,
    ViewMemberRequestComponent,
    IrpShowComponent,
    IrpDetailsComponent,
    JournalShowComponent,
    JournalDetailsComponent,
    FineShowComponent,
    UserActivationDialogeComponent,
    SettingsComponent,
    ReissueDialog,
    ArchiveDialog,
    GiveQuery,
    SeeQuery,
    QueryDetailsComponent,
    AddAuthorComponent,
    AddPublisherComponent,
    ViewAuthorComponent,
    ViewPublisherComponent,
  ],
  imports: [
    MatDialogModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatBadgeModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTreeModule,
    MatAutocompleteModule,
    MatBottomSheetModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatTableModule,
    MatTabsModule,
    DragDropModule,
    ScrollingModule,
    CdkTableModule,
    CdkTreeModule,
    ReactiveFormsModule,
    FormsModule,
    SimplePdfViewerModule,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.threeBounce,
      backdropBackgroundColour: 'rgba(1,0,0,0.1)',
      backdropBorderRadius: '4px',
      fullScreenBackdrop: true,
      primaryColour: '#fff45f',
      secondaryColour: '#ff46ff',
      tertiaryColour: '#ff345f'
    }),
    NgxPaginationModule,
    RouterModule.forRoot(
      appRoutes,
    /*  { enableTracing: true }  */// <-- debugging purposes only
    ),
  ],
  entryComponents: [
    ViewUserTypeMenuPermissionComponent,
    BookPdfVieweComponent,
    ViewIssueDetailsComponent,
    BookDetailsComponent,
    VideoDetailsComponent,
    PptDetailsComponent,
    IrpDetailsComponent,
    JournalDetailsComponent,
    FineDetailsComponent,
    UserActivationDialogeComponent,
    ReissueDialog,
    ArchiveDialog,
    GiveQuery,
    SeeQuery,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule { }

