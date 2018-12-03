/// <reference types="node" />
import { ASN1, Tag, Template, Captures, BitString } from '@fidm/asn1';
import { PublicKey } from './pki';
/**
 * Attribute for X.509v3 certificate.
 */
export interface Attribute {
    oid: string;
    value: any;
    valueTag: Tag;
    name: string;
    shortName: string;
    extensions?: Extension[];
}
/**
 * DistinguishedName for X.509v3 certificate.
 */
export declare class DistinguishedName {
    uniqueId: BitString | null;
    attributes: Attribute[];
    constructor();
    readonly commonName: string;
    readonly organizationName: string;
    readonly organizationalUnitName: string;
    readonly countryName: string;
    readonly localityName: string;
    readonly serialName: string;
    getHash(): Buffer;
    getField(key: string): Attribute | null;
    addField(attr: any): void;
    setAttrs(attrs: any): void;
    toJSON(): any;
    private getFieldValue;
}
export declare abstract class X509 {
    readonly captures: Captures;
    readonly raw: Buffer;
    readonly version: number;
    readonly serialNumber: string;
    readonly signatureOID: string;
    readonly signatureAlgorithm: string;
    readonly signature: Buffer;
    readonly subjectKeyIdentifier: string;
    readonly ocspServer: string;
    readonly issuingCertificateURL: string;
    readonly isCA: boolean;
    readonly maxPathLen: number;
    readonly basicConstraintsValid: boolean;
    readonly keyUsage: number;
    readonly dnsNames: string[];
    readonly emailAddresses: string[];
    readonly ipAddresses: string[];
    readonly uris: string[];
    readonly issuer: DistinguishedName;
    readonly extensions: Extension[];
    readonly tbsCertificate: ASN1;
    readonly subject: DistinguishedName;
    constructor(validator: Template, obj: ASN1);
    /**
     * Gets an extension by its name or oid.
     * If extension exists and a key provided, it will return extension[key].
     * ```js
     * certificate.getExtension('keyUsage')
     * certificate.getExtension('2.5.29.15')
     * // => { oid: '2.5.29.15',
     * //      critical: true,
     * //      value: <Buffer 03 02 05 a0>,
     * //      name: 'keyUsage',
     * //      digitalSignature: true,
     * //      nonRepudiation: false,
     * //      keyEncipherment: true,
     * //      dataEncipherment: false,
     * //      keyAgreement: false,
     * //      keyCertSign: false,
     * //      cRLSign: false,
     * //      encipherOnly: false,
     * //      decipherOnly: false }
     * certificate.getExtension('keyUsage', 'keyCertSign') // => false
     * ```
     * @param name extension name or OID
     * @param key key in extension
     */
    getExtension(name: string, key?: string): any;
    /**
     * Return a friendly JSON object for debuging.
     */
    toJSON(): any;
}
/**
 * X.509v3 Certificate.
 */
export declare class Certificate extends X509 {
    /**
     * Parse one or more X.509 certificates from PEM formatted buffer.
     * If there is no certificate, it will throw error.
     * @param data PEM formatted buffer
     */
    static fromPEMs(data: Buffer): Certificate[];
    /**
     * Parse an X.509 certificate from PEM formatted buffer.
     * @param data PEM formatted buffer
     */
    static fromPEM(data: Buffer): Certificate;
    readonly infoSignatureOID: string;
    readonly authorityKeyIdentifier: string;
    readonly validFrom: Date;
    readonly validTo: Date;
    readonly publicKey: PublicKey;
    readonly publicKeyRaw: Buffer;
    /**
     * Creates an X.509 certificate from an ASN.1 object
     * @param obj an ASN.1 object
     */
    constructor(obj: ASN1);
    /**
     * Returns null if a subject certificate is valid, or error if invalid.
     * Note that it does not check validity time, DNS name, ip or others.
     * @param child subject's Certificate
     */
    checkSignature(child: Certificate): Error | null;
    /**
     * Returns true if this certificate's issuer matches the passed
     * certificate's subject. Note that no signature check is performed.
     * @param parent issuer's Certificate
     */
    isIssuer(parent: Certificate): boolean;
    /**
     * Verifies the subjectKeyIdentifier extension value for this certificate
     * against its public key.
     */
    verifySubjectKeyIdentifier(): boolean;
}
/**
 * X.509v3 Certificate.
 */
export declare class CertificateSigningRequest extends X509 {
    /**
     * Parse one or more X.509 certificates from PEM formatted buffer.
     * If there is no certificate, it will throw error.
     * @param data PEM formatted buffer
     */
    static fromPEMs(data: Buffer): CertificateSigningRequest[];
    /**
     * Parse an X.509 certificate signing request from PEM formatted buffer.
     * @param data PEM formatted buffer
     */
    static fromPEM(data: Buffer): CertificateSigningRequest;
    /**
     * Creates an X.509 certificate signing from an ASN.1 object
     * @param obj an ASN.1 object
     */
    constructor(obj: ASN1);
}
export interface Extension {
    oid: string;
    critical: boolean;
    value: Buffer;
    name: string;
    altNames?: any[];
    [index: string]: any;
}
