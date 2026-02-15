import { Routes } from '@angular/router';
import { HomeComponent } from '../home-component/home-component';
import { TaskListComponent } from '../tasks/task-list-component/task-list-component';
import { TaskCreateComponent } from '../tasks/task-create-component/task-create-component';
import { TaskDetailComponent } from '../tasks/task-detail-component/task-detail-component';
import { NotFoundComponent } from '../not-found-component/not-found-component';
import { TaskLayoutComponent } from '../tasks/task-layout-component/task-layout-component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {
        path: 'tasks',
        component: TaskLayoutComponent,
        children: [
            {path: '', component: TaskListComponent},
            {path: 'create', component: TaskCreateComponent},
            {path: ':id', component: TaskDetailComponent},
        ]
    },
    {path: '**', component: NotFoundComponent}
];
