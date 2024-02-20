#!/bin/bash

# download ninja-auth-js artifact version if empty and assign to upstream_artifact_version
if [[ -z "${upstream_artifact_version}" ]]; then
  pushd ${ninja_HOME}/ninja-auth-js > /dev/null
    download_job_data global artifact_version upstream_artifact_version ninja-auth-js ${upstream_artifact_sha}
  popd > /dev/null
  echo "ninja-auth-js version that will be tested: ${upstream_artifact_version}"
fi

pushd ${ninja_HOME}/ninja-react/scripts > /dev/null
sdk_version_number="$(echo ${upstream_artifact_version} | cut -d'@' -f3)"
echo "Update ninja-auth-js version in scripts/setup.sh to ${sdk_version_number}"
sed -i "s/\(AUTHJS_VERSION\=\).*/\1\"${sdk_version_number}\"/g" setup.sh
popd > /dev/null