import React from 'react';
import { useFormikContext } from 'formik';
import { Alert, AlertVariant, Stack, StackItem } from '@patternfly/react-core';
import type { FormSelectOptionProps } from '@patternfly/react-core';
import {
  NETWORK_TYPE_CALICO,
  NETWORK_TYPE_CILIUM,
  NETWORK_TYPE_CISCO_ACI,
  NETWORK_TYPE_NONE,
  NETWORK_TYPE_OVN,
  NETWORK_TYPE_SDN,
} from '../../../../common/config';
import { SelectField } from '../../../../common/components/ui/formik';
import { ExternalLink } from '../../../../common/components/ui';
import type { NetworkConfigurationValues } from '../../../../common/types/clusters';
import { isThirdPartyCNI } from '../../utils';

const RED_HAT_CNI_SUPPORT_MATRIX_URL = 'https://access.redhat.com/articles/5436171';

const NETWORK_TYPE_LABELS: Map<string, string> = new Map([
  [NETWORK_TYPE_OVN, 'OVN-Kubernetes (default)'],
  [NETWORK_TYPE_SDN, 'OpenShift SDN'],
  [NETWORK_TYPE_CISCO_ACI, 'Cisco ACI'],
  [NETWORK_TYPE_CILIUM, 'Isovalent Cilium'],
  [NETWORK_TYPE_CALICO, 'Tigera Calico'],
  [NETWORK_TYPE_NONE, 'None (Custom CNI)'],
]);

const NETWORK_TYPE_HELPERS: Map<string, string> = new Map([
  [NETWORK_TYPE_OVN, 'Default CNI for OpenShift (recommended)'],
  [NETWORK_TYPE_SDN, 'Legacy SDN (deprecated in newer versions)'],
  [NETWORK_TYPE_CISCO_ACI, 'Cisco ACI CNI (requires custom manifests)'],
  [NETWORK_TYPE_CILIUM, 'Isovalent Cilium CNI (requires custom manifests)'],
  [NETWORK_TYPE_CALICO, 'Tigera Calico CNI (requires custom manifests)'],
  [NETWORK_TYPE_NONE, 'No CNI - user must provide custom CNI manifests'],
]);

const getLabel = (value: string) => NETWORK_TYPE_LABELS.get(value) ?? '';
const getHelperText = (value: string) => NETWORK_TYPE_HELPERS.get(value) ?? '';

export interface NetworkTypeDropDownProps {
  isDisabled?: boolean;
  isSDNSelectable: boolean;
}

export const NetworkTypeDropDown = ({
  isDisabled = false,
  isSDNSelectable,
}: NetworkTypeDropDownProps) => {
  const { values } = useFormikContext<NetworkConfigurationValues>();
  const showThirdPartyBanner = isThirdPartyCNI(values.networkType);

  const allOptions: FormSelectOptionProps[] = [
    { value: NETWORK_TYPE_OVN, label: getLabel(NETWORK_TYPE_OVN) },
    { value: NETWORK_TYPE_SDN, label: getLabel(NETWORK_TYPE_SDN) },
    { value: NETWORK_TYPE_CISCO_ACI, label: getLabel(NETWORK_TYPE_CISCO_ACI) },
    { value: NETWORK_TYPE_CILIUM, label: getLabel(NETWORK_TYPE_CILIUM) },
    { value: NETWORK_TYPE_CALICO, label: getLabel(NETWORK_TYPE_CALICO) },
    { value: NETWORK_TYPE_NONE, label: getLabel(NETWORK_TYPE_NONE) },
  ];

  const options: FormSelectOptionProps[] = isSDNSelectable
    ? allOptions
    : allOptions.filter((option) => option.value !== NETWORK_TYPE_SDN);

  return (
    <Stack hasGutter>
      <StackItem>
        <SelectField
          name="networkType"
          label="Network type"
          options={options}
          isDisabled={isDisabled}
          getHelperText={getHelperText}
        />
      </StackItem>
      {showThirdPartyBanner && (
        <StackItem>
          <Alert
            variant={AlertVariant.warning}
            isInline
            title="Third-party CNI (Technology Preview)"
          >
            <Stack hasGutter>
              <StackItem>
                Third-party CNIs require uploading CNI manifests. Please verify you have the
                required manifests and that the chosen CNI is compatible with your platform and
                OpenShift version.
              </StackItem>
              <StackItem>
                <ExternalLink href={RED_HAT_CNI_SUPPORT_MATRIX_URL}>
                  Red Hat CNI Support Matrix
                </ExternalLink>
              </StackItem>
            </Stack>
          </Alert>
        </StackItem>
      )}
    </Stack>
  );
};
