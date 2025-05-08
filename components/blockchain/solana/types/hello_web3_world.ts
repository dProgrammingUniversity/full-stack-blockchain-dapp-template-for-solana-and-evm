/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/hello_web3_world.json`.
 */
export type HelloWeb3World = {
  "address": "B3bja5VkrceMnN5b6wQZy3CKKB8eE58XGVnwMKRHMnYe",
  "metadata": {
    "name": "helloWeb3World",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "getMessage",
      "discriminator": [
        159,
        69,
        186,
        171,
        244,
        131,
        99,
        223
      ],
      "accounts": [
        {
          "name": "message"
        }
      ],
      "args": []
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
          "name": "message",
          "writable": true,
          "signer": true
        },
        {
          "name": "user",
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
      "name": "messageAccount",
      "discriminator": [
        97,
        144,
        24,
        58,
        225,
        40,
        89,
        223
      ]
    }
  ],
  "types": [
    {
      "name": "messageAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "content",
            "type": "string"
          }
        ]
      }
    }
  ]
};
