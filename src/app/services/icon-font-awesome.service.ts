import { Injectable } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { IconDefinition, IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';
import { faBan } from '@fortawesome/free-solid-svg-icons';
import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import * as brandIcons from '@fortawesome/free-brands-svg-icons';
import * as regularIcons from '@fortawesome/free-regular-svg-icons'; // Import regular icons

@Injectable({
  providedIn: 'root',
})
export class IconFontAwesomeService {
  constructor(private faIconLibrary: FaIconLibrary) {
    // Add solid icons
    const solidIconsArray = Object.keys(solidIcons)
      .map(icon => solidIcons[icon])
      .filter((icon): icon is IconDefinition => !!icon.icon);

    // Add brand icons
    const brandIconsArray = Object.keys(brandIcons)
      .map(icon => brandIcons[icon])
      .filter((icon): icon is IconDefinition => !!icon.icon);

    // Add regular icons
    const regularIconsArray = Object.keys(regularIcons)
      .map(icon => regularIcons[icon])
      .filter((icon): icon is IconDefinition => !!icon.icon);

    // Register all icons in the library
    this.faIconLibrary.addIcons(...solidIconsArray, ...brandIconsArray, ...regularIconsArray);
  }

  getIcon(iconName: string, type: any = 'fas'): IconDefinition {
    const fallbackIcon: IconDefinition = faBan;

    if (!iconName) return fallbackIcon;

    let prefix: IconPrefix = type; // Default to 'fas' (solid)
    let name: IconName = iconName as IconName;

    /* if (iconName.includes(' ')) {
      const [iconPrefix, iconNamePart] = iconName.split(' ');
      prefix = iconPrefix as IconPrefix;
      name = iconNamePart as IconName;
    } */

    // Explicitly cast to IconDefinition to resolve the type conflict
    const icon = this.faIconLibrary.getIconDefinition(prefix, name) as IconDefinition;
    return icon || fallbackIcon;
  }

  getBrandIcons(): IconDefinition[] {
    return Object.keys(brandIcons)
      .map(icon => brandIcons[icon])
      .filter((icon): icon is IconDefinition => !!icon.icon);
  }
}
