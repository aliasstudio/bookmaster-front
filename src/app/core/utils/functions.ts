import { FormEditorDirective } from '@app/shared/directives/form-editor.directive';
import { StaticProvider, Type } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DestroyService } from '@app/core/services/destroy.service';
import * as _ from 'lodash';
import { Registry, RegistryPrivilege } from '@app/auth/models/privilege';

export function hasViewPrivilege(
  registryKey: Registry,
  registries: Record<Registry, RegistryPrivilege[]>,
): boolean {
  return (
    _.has(registries, Registry.All) ||
    !!_.get(registries, registryKey)?.includes(RegistryPrivilege.Select)
  );
}

export function hasEditPrivilege(
  registryKey: Registry,
  registries: Record<Registry, RegistryPrivilege[]>,
): boolean {
  return (
    _.has(registries, Registry.All) ||
    !!_.get(registries, registryKey)?.includes(RegistryPrivilege.Edit)
  );
}

export function provideFormEditor(
  ref: Type<FormEditorDirective<any>>,
): StaticProvider[] {
  return [
    {
      provide: FormEditorDirective,
      useExisting: ref,
    },
    {
      provide: DestroyService,
    },
  ];
}

export function provideValueAccessor(ref: Type<any>): StaticProvider[] {
  return [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ref,
      multi: true,
    },
    {
      provide: DestroyService,
    },
  ];
}
