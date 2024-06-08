/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/basic.json`.
 */
export type Basic = {
  "address": "6y3BPsRqKBc4skcVmza2BkfRFRpd8yUjc7bYY8WyjqKc",
  "metadata": {
    "name": "basic",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createJob",
      "discriminator": [
        178,
        130,
        217,
        110,
        100,
        27,
        82,
        119
      ],
      "accounts": [
        {
          "name": "job",
          "writable": true,
          "signer": true
        },
        {
          "name": "jobList",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  106,
                  111,
                  98,
                  95,
                  108,
                  105,
                  115,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "jobName",
          "type": "string"
        },
        {
          "name": "companyName",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "skills",
          "type": {
            "vec": "string"
          }
        }
      ]
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "jobList",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  106,
                  111,
                  98,
                  95,
                  108,
                  105,
                  115,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "job",
      "discriminator": [
        75,
        124,
        80,
        203,
        161,
        180,
        202,
        80
      ]
    },
    {
      "name": "jobList",
      "discriminator": [
        49,
        102,
        21,
        76,
        155,
        131,
        18,
        47
      ]
    }
  ],
  "types": [
    {
      "name": "job",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "jobName",
            "type": "string"
          },
          {
            "name": "companyName",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "skills",
            "type": {
              "vec": "string"
            }
          }
        ]
      }
    },
    {
      "name": "jobList",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "count",
            "type": "u64"
          },
          {
            "name": "jobs",
            "type": {
              "vec": "pubkey"
            }
          }
        ]
      }
    }
  ]
};
