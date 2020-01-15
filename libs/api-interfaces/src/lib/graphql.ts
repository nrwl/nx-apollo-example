
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export interface IMutation {
    addSet(name?: string, year?: string, numParts?: number): Set | Promise<Set>;
}

export interface IQuery {
    allSets(): Set[] | Promise<Set[]>;
}

export interface Set {
    id: number;
    name?: string;
    year?: number;
    numParts?: number;
}
